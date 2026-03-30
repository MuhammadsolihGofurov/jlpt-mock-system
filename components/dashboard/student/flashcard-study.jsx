import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, EffectCards } from "swiper/modules";
import { Maximize2, Minimize2, Shuffle, ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

const FlashcardStudy = ({ cards, mode, onModeChange }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0); // Swiper indeksini kuzatish uchun
    const [flippedCards, setFlippedCards] = useState({});
    const containerRef = useRef(null); // Fullscreen uchun komponent refi
    const [swiperInstance, setSwiperInstance] = useState(null);
    const intl = useIntl();

    // Karta o'zgarganda flip holatini tozalash (ixtiyoriy)
    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
    };

    const toggleFlip = (id) => {
        setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Fullscreen o'zgarganda stateni yangilash
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const progress = ((activeIndex + 1) / cards.length) * 100;

    return (
        <div
            ref={containerRef}
            className={`w-full flex flex-col transition-all duration-300 ${isFullscreen ? 'bg-[#f8fafc] p-6 h-screen justify-center overflow-hidden' : 'relative'
                }`}
        >
            {/* Top Controls */}
            <div className={`flex justify-between items-center mb-6 ${isFullscreen ? 'max-w-6xl mx-auto w-full' : ''}`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onModeChange(mode === 'SEQUENTIAL' ? 'SHUFFLE' : 'SEQUENTIAL')}
                        className={`p-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm shadow-sm border ${mode === 'SHUFFLE'
                            ? 'bg-orange-500 text-white border-orange-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        <Shuffle size={18} /> {intl.formatMessage({ id: mode === 'SHUFFLE' ? "Tasodifiy" : "Tartibli" })}
                    </button>
                </div>

                <button
                    onClick={toggleFullscreen}
                    className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-slate-600"
                >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
            </div>

            {/* Main Swiper Area */}
            <div className={`w-full max-w-5xl mx-auto ${isFullscreen ? 'h-[60vh]' : 'h-[500px]'}`}>
                <Swiper
                    modules={[Navigation, Pagination, Keyboard, EffectCards]}
                    spaceBetween={30}
                    slidesPerView={1}
                    onSwiper={setSwiperInstance}
                    onSlideChange={handleSlideChange}
                    keyboard={{ enabled: true }}
                    className="h-full rounded-[3rem] shadow-2xl shadow-slate-200/50"
                >
                    {cards.map((card) => (
                        <SwiperSlide key={card.id}>
                            <div
                                className="w-full h-full cursor-pointer perspective-1000 group"
                                onClick={() => toggleFlip(card.id)}
                            >
                                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flippedCards[card.id] ? 'rotate-x-180' : ''}`}>

                                    {/* Front: Term */}
                                    <div className="absolute inset-0 backface-hidden bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center p-12 text-center shadow-inner">
                                        <div className="absolute top-10 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                                            <span className="text-slate-300 font-black text-[10px] uppercase tracking-[0.3em]">{intl.formatMessage({ id: "Termin" })}</span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight select-none">
                                            {card.term}
                                        </h2>
                                        {card.image_link && <img src={card.image_link} className="mt-8 max-h-40 rounded-3xl object-contain shadow-lg" alt="" />}
                                        <div className="absolute bottom-10 flex flex-col items-center gap-2">
                                            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">{intl.formatMessage({ id: "Ko'rish uchun bosing" })}</p>
                                        </div>
                                    </div>

                                    {/* Back: Definition */}
                                    <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center rotate-x-180">
                                        <div className="absolute top-10">
                                            <span className="text-orange-400/50 font-black text-[10px] uppercase tracking-[0.3em]">{intl.formatMessage({ id: "Ta'rif" })}</span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-medium text-white leading-relaxed select-none">
                                            {card.definition}
                                        </h2>
                                        <p className="absolute bottom-10 text-slate-500 text-[10px] font-bold uppercase tracking-widest">{intl.formatMessage({ id: "Orqaga qaytish uchun bosing" })}</p>
                                    </div>

                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Bottom Navigation */}
            <div className={`flex flex-col items-center gap-6 mt-10 ${isFullscreen ? 'max-w-xl mx-auto w-full' : ''}`}>
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => swiperInstance?.slidePrev()}
                        className="p-4 bg-white border border-slate-100 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all text-slate-400 shadow-md active:scale-90"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex flex-col items-center select-none">
                        <span className="text-2xl font-black text-slate-800 tabular-nums">
                            {activeIndex + 1} <span className="text-slate-300 mx-1">/</span> {cards.length}
                        </span>
                    </div>

                    <button
                        onClick={() => swiperInstance?.slideNext()}
                        className="p-4 bg-white border border-slate-100 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all text-slate-400 shadow-md active:scale-90"
                    >
                        <ArrowRight size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-xs h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="bg-orange-500 h-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-x-180 { transform: rotateX(180deg); }
            `}</style>
        </div>
    );
};

export default FlashcardStudy;