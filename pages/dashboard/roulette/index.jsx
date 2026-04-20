import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  LoaderCircle,
  MessageCircle,
  PhoneOff,
  PlayCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Seo } from "@/components/seo";
import { PageHeader } from "@/components/layout";
import { withAuthGuard } from "@/components/guard";
import { authAxios } from "@/utils/axios";
import useWebSocket from "@/hooks/useWebSocket";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";

const RouletteState = {
  IDLE: "idle",
  CONNECTING_WS: "connecting_ws",
  WAITING: "waiting",
  MATCHED_CONNECTING_LIVEKIT: "matched_connecting_livekit",
  IN_CALL: "in_call",
  ENDING: "ending",
};

const WS_STATE_LABEL = {
  connecting: "Connecting",
  open: "Open",
  closed: "Closed",
};

function buildWsUrl(base) {
  const normalized = (base || "").trim();
  if (!normalized) return "";
  const hasSlash = normalized.endsWith("/");
  return `${normalized}${hasSlash ? "" : "/"}ws/roulette/`;
}

function RoulettePage() {
  const intl = useIntl();

  const [rouletteState, setRouletteState] = useState(RouletteState.IDLE);
  const [queueInfo, setQueueInfo] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [roomRenderKey, setRoomRenderKey] = useState(0);

  const stateRef = useRef(RouletteState.IDLE);
  const prevReadyStateRef = useRef("closed");

  useEffect(() => {
    stateRef.current = rouletteState;
  }, [rouletteState]);

  const rouletteWsUrl = useMemo(
    () => buildWsUrl(process.env.NEXT_PUBLIC_WEB_SOKET_API_URL),
    [],
  );

  const { lastMessage, readyState } = useWebSocket(rouletteWsUrl);

  const resetToIdle = useCallback((clearError = true) => {
    setRouletteState(RouletteState.IDLE);
    setQueueInfo(null);
    setMatchInfo(null);
    setRoomRenderKey((prev) => prev + 1);
    if (clearError) {
      setErrorMessage("");
    }
  }, []);

  const applyStatusPayload = useCallback((payload) => {
    const state = payload?.state;

    if (state === "idle") {
      setQueueInfo(null);
      setMatchInfo(null);
      setRouletteState(RouletteState.IDLE);
      return;
    }

    if (state === "waiting") {
      setQueueInfo({
        queue_id: payload.queue_id,
        expires_at: payload.expires_at,
      });
      setMatchInfo(null);
      setRouletteState(RouletteState.WAITING);
      return;
    }

    if (state === "matched") {
      setQueueInfo(null);
      setMatchInfo(payload);
      setRouletteState(RouletteState.MATCHED_CONNECTING_LIVEKIT);
      setRoomRenderKey((prev) => prev + 1);
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await authAxios.get("roulette/status/");
      applyStatusPayload(data);
      setErrorMessage("");
      return data;
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.detail ||
          "Failed to get roulette status. Please try again.",
      );
      return null;
    }
  }, [applyStatusPayload]);

  useEffect(() => {
    const wasOpen = prevReadyStateRef.current === "open";
    const isOpen = readyState === "open";

    if (!wasOpen && isOpen) {
      fetchStatus();
    }

    if (readyState === "connecting" && stateRef.current === RouletteState.IDLE) {
      setRouletteState(RouletteState.CONNECTING_WS);
    }

    prevReadyStateRef.current = readyState;
  }, [fetchStatus, readyState]);

  useEffect(() => {
    if (!lastMessage || typeof lastMessage !== "object") return;

    if (lastMessage.event === "match_found") {
      fetchStatus();
      toast.success("Match found. Joining room...");
      return;
    }

    if (lastMessage.event === "queue_canceled") {
      resetToIdle();
      return;
    }

    if (lastMessage.event === "match_ended") {
      resetToIdle();
      toast.info("Match ended.");
    }
  }, [fetchStatus, lastMessage, resetToIdle]);

  useEffect(() => {
    if (rouletteState !== RouletteState.WAITING) return undefined;

    const poll = setInterval(() => {
      fetchStatus();
    }, 3000);

    return () => clearInterval(poll);
  }, [fetchStatus, rouletteState]);

  const handleStart = useCallback(async () => {
    setErrorMessage("");

    try {
      const { data } = await authAxios.post("roulette/start/", {});
      applyStatusPayload(data);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.detail || "Failed to start matching.",
      );
    }
  }, [applyStatusPayload]);

  const handleCancel = useCallback(async () => {
    setErrorMessage("");

    try {
      await authAxios.post("roulette/cancel/", {});
      resetToIdle();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.detail || "Failed to cancel queue.",
      );
    }
  }, [resetToIdle]);

  const handleEndMatch = useCallback(async () => {
    setRouletteState(RouletteState.ENDING);
    setErrorMessage("");

    try {
      await authAxios.post("roulette/end/", { reason: "user_left" });
      resetToIdle();
    } catch (error) {
      setErrorMessage(error?.response?.data?.detail || "Failed to end match.");
      setRouletteState(RouletteState.IN_CALL);
    }
  }, [resetToIdle]);

  const isConnecting = rouletteState === RouletteState.CONNECTING_WS;
  const isWaiting = rouletteState === RouletteState.WAITING;
  const isMatched = rouletteState === RouletteState.MATCHED_CONNECTING_LIVEKIT;
  const isInCall = rouletteState === RouletteState.IN_CALL;
  const isEnding = rouletteState === RouletteState.ENDING;
  const isBusy = isConnecting || isEnding;

  const canStart =
    readyState === "open" && !isBusy && !isWaiting && !isMatched && !isInCall;
  const showLiveKitRoom = !!matchInfo && (isMatched || isInCall || isEnding);

  const queueExpiryText = queueInfo?.expires_at
    ? new Date(queueInfo.expires_at).toLocaleTimeString()
    : null;

  return (
    <>
      <Seo
        title={intl.formatMessage({ id: "Live Chat" })}
        description={intl.formatMessage({ id: "Random video chat lobby" })}
        keywords={intl.formatMessage({ id: "roulette, live chat, video call" })}
      />

      <PageHeader
        title="Live Chat"
        description="Random video chat lobby"
        badge="Beta"
      />

      <section className="w-full space-y-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-primary" />
              WS: {WS_STATE_LABEL[readyState] || "Closed"}
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 font-semibold text-primary">
              State: {rouletteState}
            </div>
          </div>
        </div>

        {!showLiveKitRoom && (
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5">
              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-primary">
                  <MessageCircle size={14} />
                  Roulette
                </p>
                <h2 className="text-2xl font-black tracking-tight text-heading">
                  {intl.formatMessage({ id: "Ready for a random conversation?" })}
                </h2>
                <p className="max-w-2xl text-sm font-medium text-muted">
                  Join the queue and get matched in real time. When a partner is found,
                  your video room opens automatically.
                </p>
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                  <AlertTriangle size={16} className="mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isWaiting && queueInfo && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                  Waiting in queue: <span className="font-black">{queueInfo.queue_id}</span>
                  {queueExpiryText ? ` (expires at ${queueExpiryText})` : ""}
                </div>
              )}

              {matchInfo && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {matchInfo.partner
                    ? `Matched with ${matchInfo.partner.first_name || "Partner"} ${matchInfo.partner.last_name || ""}`.trim()
                    : "Match found."}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={!canStart}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {(isConnecting || isMatched) ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <PlayCircle size={18} />
                  )}
                  Start
                </button>

                <button
                  type="button"
                  onClick={fetchStatus}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 font-semibold text-heading transition-all hover:bg-gray-50"
                >
                  <RefreshCw size={17} />
                  Refresh Status
                </button>

                {isWaiting && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 font-semibold text-orange-600 transition-all hover:bg-orange-100"
                  >
                    <XCircle size={17} />
                    Cancel Queue
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {showLiveKitRoom && (
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-black shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-4 py-3 text-white">
              <p className="text-sm font-semibold">
                Room: {matchInfo?.room_name || "Live Room"}
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-500/20 px-2 py-1 text-xs font-bold uppercase tracking-wide text-emerald-300">
                  {isInCall ? "In Call" : "Connecting"}
                </span>
                <button
                  type="button"
                  onClick={handleEndMatch}
                  disabled={isEnding}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300/40 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isEnding ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <PhoneOff size={16} />
                  )}
                  End Match
                </button>
              </div>
            </div>

            <LiveKitRoom
              key={`${matchInfo?.match_id}-${roomRenderKey}`}
              token={matchInfo?.token}
              serverUrl={matchInfo?.livekit_url}
              connect={true}
              video={true}
              audio={true}
              onConnected={() => {
                setRouletteState(RouletteState.IN_CALL);
              }}
              onDisconnected={() => {
                if (stateRef.current !== RouletteState.ENDING) {
                  resetToIdle(false);
                }
              }}
              style={{ height: "78vh", width: "100%" }}
            >
              <VideoConference />
              <RoomAudioRenderer />
            </LiveKitRoom>
          </div>
        )}
      </section>
    </>
  );
}

export default withAuthGuard(RoulettePage, [
  "OWNER",
  "CENTER_ADMIN",
  "TEACHER",
  "STUDENT",
]);
