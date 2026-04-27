import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Headset, RotateCcw, Volume2, VolumeX, Volume1, Play, Pause, SkipForward } from "lucide-react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";

export const JFTQuestionRenderer = ({
    group,
    onSelect,
    selectedAnswers,
    isActiveGroup,
    onAudioEnd,
    sectionType,
    isLastGroup,  // oxirgi guruh — auto-next va skip ishlamaydi
    audioMode,    // kept for compatibility
}) => {
    const intl = useIntl();
    const audioRef = useRef(null);
    const replayTimerRef = useRef(null);

    const [playCounts, setPlayCounts] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioFinished, setIsAudioFinished] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [replayRequested, setReplayRequested] = useState(false);

    // Audio URL: group.audio_file (shared) yoki birinchi question.audio_file
    const audioUrl = group.audio_file || group.questions?.[0]?.audio_file;

    // Har yangi group kelganda barcha holatni tozalash
    useEffect(() => {
        setIsPlaying(false);
        setIsAudioFinished(false);
        setReplayRequested(false);
        setCurrentTime(0);
        setDuration(0);
        if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
    }, [group.id]);

    // LISTENING + isActiveGroup bo'lganda audio avtomatik boshlash
    useEffect(() => {
        if (sectionType === "LISTENING" && isActiveGroup && audioUrl) {
            const delayTimer = setTimeout(() => {
                playAudio(audioUrl);
            }, 600);
            return () => clearTimeout(delayTimer);
        }
    }, [isActiveGroup, group.id, sectionType]);

    // Volume/mute sinxronlash
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const playAudio = useCallback((url) => {
        if (!url || !audioRef.current) return;

        const currentCount = playCounts[url] || 0;
        if (currentCount >= 2) {
            toast.warn("Maksimal tinglash soni: 2 marta");
            return;
        }

        audioRef.current.src = url;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.load();
        audioRef.current.play()
            .then(() => {
                setIsPlaying(true);
                setIsAudioFinished(false);
                setPlayCounts(prev => ({ ...prev, [url]: (prev[url] || 0) + 1 }));
            })
            .catch(err => {
                console.error("Audio play error:", err);
            });
    }, [playCounts, volume, isMuted]);

    const handleReplay = () => {
        if (!audioUrl) return;
        setReplayRequested(true);
        setIsAudioFinished(false);
        if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
        playAudio(audioUrl);
    };

    const handleTogglePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            if (audioRef.current.src) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
            } else {
                playAudio(audioUrl);
            }
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
        setIsAudioFinished(true);
        setReplayRequested(false);
        // Avtomatik keyingi guruhga O'TILMAYDI — faqat user tugma bosganida o'tiladi
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const val = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = val;
            setCurrentTime(val);
        }
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        setIsMuted(val === 0);
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    const formatTime = (sec) => {
        if (!sec || isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // Guruhning barcha savollari javoblanganligi
    const isAllGroupAnswered = useMemo(() => {
        if (!group?.questions?.length) return false;
        return group.questions.every(
            (q) =>
                selectedAnswers.hasOwnProperty(q.id) &&
                selectedAnswers[q.id] !== undefined &&
                selectedAnswers[q.id] !== null
        );
    }, [group.questions, selectedAnswers]);

    // "Keyingi savol" tugmasi: barcha javoblar berilgan + LISTENING + oxirgi guruh emas
    const canSkip = sectionType === "LISTENING" && isActiveGroup && isAllGroupAnswered && !isLastGroup;

    const handleSkipToNext = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
        if (onAudioEnd) onAudioEnd();
    };

    const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
    const playCount = playCounts[audioUrl] || 0;

    return (
        <div
            className={`mb-12 rounded-[2rem] border transition-all duration-500 overflow-hidden
                ${isActiveGroup
                    ? "bg-white border-primary shadow-2xl scale-[1.01]"
                    : "bg-slate-50 border-slate-200 opacity-60 pointer-events-none"
                }`}
        >
            <audio
                ref={audioRef}
                onEnded={handleAudioEnded}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                hidden
            />

            {/* LISTENING Audio Player Panel */}
            {sectionType === "LISTENING" && audioUrl && (
                <div className={`px-6 pt-6 pb-4 transition-colors duration-300
                    ${isPlaying
                        ? "bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200"
                        : "bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200"
                    }`}
                >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            {/* Play/Pause */}
                            <button
                                onClick={handleTogglePlayPause}
                                disabled={playCount >= 2 && !isPlaying}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md
                                    ${isPlaying
                                        ? "bg-primary text-white shadow-orange-200"
                                        : playCount >= 2
                                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                            : "bg-white text-primary border-2 border-primary hover:bg-orange-50"
                                    }`}
                            >
                                {isPlaying
                                    ? <Pause size={16} fill="currentColor" />
                                    : <Play size={16} fill="currentColor" className="ml-0.5" />
                                }
                            </button>

                            {/* Headset */}
                            <div className={`p-2 rounded-full transition-all
                                ${isPlaying ? "bg-primary/10 text-primary" : "bg-slate-200 text-slate-400"}`}>
                                <Headset size={18} className={isPlaying ? "animate-pulse" : ""} />
                            </div>

                            <div>
                                <p className="font-bold text-slate-800 text-sm leading-tight">
                                    {isPlaying
                                        ? "Audio chalinmoqda..."
                                        : isAudioFinished
                                            ? "Audio yakunlandi"
                                            : "Audio tayyor"}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {intl.formatMessage({ id: "Tinglashlar" })}: {playCount}/2
                                    {playCount >= 2 && (
                                        <span className="text-red-400 ml-1">(limit)</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Qayta tinglash */}
                            {isAudioFinished && playCount < 2 && (
                                <button
                                    onClick={handleReplay}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-200"
                                >
                                    <RotateCcw size={12} />
                                    {intl.formatMessage({ id: "Qayta tinglash" })}
                                </button>
                            )}

                            {/* Keyingi savol */}
                            {canSkip && (
                                <button
                                    onClick={handleSkipToNext}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-200"
                                >
                                    <SkipForward size={12} />
                                    {intl.formatMessage({ id: "Keyingi savol" })}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Progress bar */}
                    {duration > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-slate-400 w-8 text-right tabular-nums">
                                {formatTime(currentTime)}
                            </span>
                            <input
                                type="range"
                                min={0}
                                max={duration}
                                step={0.1}
                                value={currentTime}
                                // onChange={handleSeek}
                                className="flex-1 h-1.5 rounded-full accent-primary cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #f97316 ${(currentTime / duration) * 100}%, #e2e8f0 ${(currentTime / duration) * 100}%)`
                                }}
                            />
                            <span className="text-xs text-slate-400 w-8 tabular-nums">
                                {formatTime(duration)}
                            </span>
                        </div>
                    )}

                    {/* Volume control */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleMute}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <VolumeIcon size={15} />
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-24 h-1 rounded-full accent-primary cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #f97316 ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 ${(isMuted ? 0 : volume) * 100}%)`
                            }}
                        />
                        <span className="text-xs text-slate-400">
                            {Math.round((isMuted ? 0 : volume) * 100)}%
                        </span>
                    </div>
                </div>
            )}

            {/* Question Content */}
            <div className="p-6 sm:p-8">
                <div className="mb-6">
                    <span className="px-4 py-1 rounded-full text-xs font-black uppercase bg-primary text-white">
                        Mondai {group.mondai_number || "1"}
                    </span>
                    {group?.title && (
                        <h4 className="text-xl font-black mt-4 text-slate-800 leading-tight">
                            {group.title}
                        </h4>
                    )}
                    {group?.instruction && (
                        <div
                            className="text-slate-500 mt-2 text-sm italic"
                            dangerouslySetInnerHTML={{ __html: group.instruction }}
                        />
                    )}
                </div>

                <div className="space-y-8">
                    {group?.questions.map((q) => {
                        const qAudioUrl = !group.audio_file ? q.audio_file : null;

                        return (
                            <div key={q.id} className="p-4 rounded-2xl border border-dashed border-slate-200">
                                {/* Mini audio player (question-level) */}
                                {sectionType === "LISTENING" && qAudioUrl && (
                                    <div className="mb-3 flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                                        <button
                                            onClick={() => playAudio(qAudioUrl)}
                                            disabled={(playCounts[qAudioUrl] || 0) >= 2}
                                            className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-orange-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Play size={12} fill="currentColor" className="ml-0.5" />
                                        </button>
                                        <span className="text-xs text-slate-500">
                                            {intl.formatMessage({ id: "Savol audiosi" })} · {playCounts[qAudioUrl] || 0}/2
                                        </span>
                                    </div>
                                )}

                                <div className="text-slate-800 mb-4 text-lg flex gap-3">
                                    <span className="font-black text-primary shrink-0">
                                        {q.question_number}.
                                    </span>
                                    <div dangerouslySetInnerHTML={{ __html: q.text }} />
                                    {q.image && (
                                        <img
                                            src={q.image}
                                            alt={`Question ${q.question_number}`}
                                            className="mt-3 max-w-sm rounded-xl border border-slate-100 object-contain"
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((option, oIdx) => {
                                        const isSelected = selectedAnswers[q.id] === oIdx;
                                        return (
                                            <button
                                                key={oIdx}
                                                onClick={() => onSelect(q.id, oIdx)}
                                                className={`p-4 text-left rounded-xl border-2 transition-all flex items-center gap-4
                                                    ${isSelected
                                                        ? "border-primary bg-orange-50"
                                                        : "border-slate-100 bg-white hover:border-slate-300"
                                                    }`}
                                            >
                                                <span className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border font-bold text-sm
                                                    ${isSelected
                                                        ? "bg-primary border-primary text-white"
                                                        : "border-slate-200 text-slate-400 bg-slate-50"
                                                    }`}>
                                                    {oIdx + 1}
                                                </span>
                                                <span className="font-medium text-sm text-slate-700 flex items-center gap-2 flex-wrap">
                                                    {option.image && (
                                                        <img
                                                            src={option.image}
                                                            alt={`Option ${oIdx + 1}`}
                                                            className="max-h-20 rounded-lg object-contain"
                                                        />
                                                    )}
                                                    {option.text && <span>{option.text}</span>}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};