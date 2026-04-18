import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const READY_STATE = {
  CONNECTING: "connecting",
  OPEN: "open",
  CLOSED: "closed",
};

const MAX_RECONNECT_ATTEMPTS = 8;
const BASE_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 15000;

function withJwtToken(url) {
  if (!url) return "";

  const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;
  if (!token) return url;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set("token", token);
    return parsed.toString();
  } catch (_error) {
    // Fallback for relative URLs.
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}token=${encodeURIComponent(token)}`;
  }
}

export default function useWebSocket(url) {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isManuallyClosedRef = useRef(false);

  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(READY_STATE.CLOSED);

  const normalizedUrl = useMemo(() => (url || "").trim(), [url]);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (typeof window === "undefined" || !normalizedUrl) return;

    const socketUrl = withJwtToken(normalizedUrl);
    if (!socketUrl) return;

    setReadyState(READY_STATE.CONNECTING);

    const ws = new WebSocket(socketUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
      setReadyState(READY_STATE.OPEN);
    };

    ws.onmessage = (event) => {
      try {
        setLastMessage(JSON.parse(event.data));
      } catch (_error) {
        setLastMessage(event.data);
      }
    };

    ws.onerror = () => {
      ws.close();
    };

    ws.onclose = () => {
      setReadyState(READY_STATE.CLOSED);

      if (isManuallyClosedRef.current) return;
      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) return;

      const delay = Math.min(
        BASE_RECONNECT_DELAY_MS * (2 ** reconnectAttemptsRef.current),
        MAX_RECONNECT_DELAY_MS,
      );
      reconnectAttemptsRef.current += 1;

      clearReconnectTimeout();
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, delay);
    };
  }, [clearReconnectTimeout, normalizedUrl]);

  useEffect(() => {
    if (!normalizedUrl) return undefined;

    isManuallyClosedRef.current = false;
    reconnectAttemptsRef.current = 0;
    connect();

    return () => {
      isManuallyClosedRef.current = true;
      clearReconnectTimeout();

      const socket = socketRef.current;
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        socket.close();
      }
      socketRef.current = null;
      setReadyState(READY_STATE.CLOSED);
    };
  }, [clearReconnectTimeout, connect, normalizedUrl]);

  const sendMessage = useCallback((message) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    const payload = typeof message === "string" ? message : JSON.stringify(message);
    socket.send(payload);
    return true;
  }, []);

  return {
    lastMessage,
    readyState,
    sendMessage,
  };
}
