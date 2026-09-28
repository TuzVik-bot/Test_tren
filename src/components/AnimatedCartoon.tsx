import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  ArrowRight,
  Flame,
  Bot,
  User,
  ShieldAlert
} from 'lucide-react';

interface AnimatedCartoonProps {
  onFinish: () => void;
  onClose?: () => void;
}

interface CartoonScene {
  id: number;
  title: string;
  badge: string;
  speaker: 'max' | 'bot' | 'elena' | 'narrator';
  speakerName: string;
  speakerRole: string;
  speech: string;
  statusColor: string;
  sceneTheme: 'office' | 'danger' | 'traffic' | 'success';
}

const SCENES: CartoonScene[] = [
  {
    id: 1,
    title: 'Пятничный дедлайн в Onliner Prime',
    badge: 'Сцена 1 • Минск, ТЛЦ «Колядичи»',
    speaker: 'max',
    speakerName: 'Максим Кузнецов',
    speakerRole: 'Ведущий логист Onliner Доставка',
    speech: '— Караул! На таможне зависли 8 контейнеров с электроникой для Каталога Onliner! Паспорт водителя, китайский инвойс на 400 позиций и контрактные ставки фрахта... Как обработать всё до 18:00?!',
    statusColor: 'border-blue-500 text-blue-600',
    sceneTheme: 'office'
  },
  {
    id: 2,
    title: 'Искушение «Чудо-роботом»',
    badge: 'Сцена 2 • Облачная нейросеть',
    speaker: 'bot',
    speakerName: 'Облачный ИИ-бот',
    speakerRole: 'Публичная генеративная нейросеть',
    speech: '— Пс-с, Максим! Не парься! Просто залей в меня весь Excel с закрытыми тарифами Maersk, сканы паспортов водителей и нажми Enter! Я всё посчитаю... и сохраню у себя на сервере в облаке!',
    statusColor: 'border-amber-500 text-amber-600',
    sceneTheme: 'office'
  },
  {
    id: 3,
    title: 'КРАСНАЯ ТРЕВОГА! Утечка и санкции!',
    badge: 'Сцена 3 • Инцидент информационной безопасности',
    speaker: 'elena',
    speakerName: 'Елена Викторовна',
    speakerRole: 'Руководитель службы безопасности Onliner',
    speech: '— СТОП! Сирены воют! Бот сгаллюцинировал код ТН ВЭД со ставкой 0% вместо 10% — таможня выписала штраф 200%! А контрактные скидки Onliner утекли в открытый доступ! Публичные ИИ обучаются на наших промтах!',
    statusColor: 'border-red-500 text-red-600',
    sceneTheme: 'danger'
  },
  {
    id: 4,
    title: 'Светофор безопасности Onliner',
    badge: 'Сцена 4 • Золотой стандарт регламента',
    speaker: 'elena',
    speakerName: 'Елена Викторовна',
    speakerRole: 'Руководитель службы безопасности Onliner',
    speech: '— Запомни правило трех цветов: 🔴 КРАСНЫЙ (ставки, ПДН, санкции, пароли) — строжайший запрет! 🟡 ЖЕЛТЫЙ — обезличь [Компания А] и сотри суммы [XXX]. 🟢 ЗЕЛЕНЫЙ — формулы Excel и перевод общедоступных конвенций!',
    statusColor: 'border-amber-500 text-amber-600',
    sceneTheme: 'traffic'
  },
  {
    id: 5,
    title: 'Победа технологий и безопасности!',
    badge: 'Сцена 5 • Аттестация и премия',
    speaker: 'max',
    speakerName: 'Максим Кузнецов',
    speakerRole: 'Аттестованный логист Onliner',
    speech: '— Ура! Я обезличил инвойс, формулу Excel посчитал локально, а судно проверил в официальном реестре OFAC SDN. Контейнеры растаможены за 2 часа, данные Onliner под замком!',
    statusColor: 'border-emerald-500 text-emerald-600',
    sceneTheme: 'success'
  }
];

export const AnimatedCartoon: React.FC<AnimatedCartoonProps> = ({ onFinish, onClose }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const scene = SCENES[currentSceneIdx];

  // Gentle synth beep via Web Audio API for comic sound
  const playSoundEffect = (type: 'pop' | 'alarm' | 'fanfare') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'alarm') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'fanfare') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch {
      // AudioContext not permitted or supported
    }
  };

  useEffect(() => {
    if (scene.sceneTheme === 'danger') {
      playSoundEffect('alarm');
    } else if (scene.sceneTheme === 'success') {
      playSoundEffect('fanfare');
    } else {
      playSoundEffect('pop');
    }
  }, [currentSceneIdx]);

  // Autoplay progression (6.5 seconds per scene)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentSceneIdx < SCENES.length - 1) {
        setCurrentSceneIdx((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 6500);

    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneIdx]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Onliner header bar */}
        <div className="bg-[#ffd300] px-5 py-3.5 flex items-center justify-between border-b border-amber-400">
          <div className="flex items-center gap-3">
            <span className="bg-black text-[#ffd300] font-black text-sm px-2 py-0.5 rounded tracking-tighter font-sans">
              onlíner
            </span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
              <span>Мультфильм: «Как Onliner укротил ИИ в логистике»</span>
              <Sparkles className="w-4 h-4 text-slate-800" />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-slate-900 transition"
              title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onFinish}
              className="text-xs font-bold text-slate-800 hover:text-black bg-black/10 hover:bg-black/20 px-2.5 py-1 rounded-lg transition"
            >
              Пропустить мультик ✕
            </button>
          </div>
        </div>

        {/* Animated Theater Stage */}
        <div 
          className={`relative h-64 sm:h-72 p-6 flex flex-col justify-between transition-colors duration-700 overflow-hidden ${
            scene.sceneTheme === 'danger'
              ? 'bg-gradient-to-b from-red-50 to-red-100/60'
              : scene.sceneTheme === 'traffic'
              ? 'bg-gradient-to-b from-amber-50 to-amber-100/60'
              : scene.sceneTheme === 'success'
              ? 'bg-gradient-to-b from-emerald-50 to-emerald-100/60'
              : 'bg-gradient-to-b from-slate-50 to-blue-50/50'
          }`}
        >
          {/* Animated Background Decor */}
          {scene.sceneTheme === 'danger' && (
            <div className="absolute top-2 right-4 flex items-center gap-1.5 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse shadow-md">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>СИСТЕМА БЕЗОПАСНОСТИ: ТРЕВОГА!</span>
            </div>
          )}

          {/* Top Scene Tracker */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-sm">
              {scene.badge}
            </span>
            <div className="flex items-center gap-1">
              {SCENES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSceneIdx(idx);
                    setIsPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSceneIdx
                      ? 'w-6 bg-[#ffd300] border border-amber-500 shadow-sm'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Animated Actors Illustration */}
          <div className="flex items-center justify-around my-auto z-10 py-2">
            {/* Actor 1: Logist Max */}
            <div className="flex flex-col items-center">
              <div 
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 ${
                  scene.speaker === 'max'
                    ? 'scale-110 ring-4 ring-[#ffd300] bg-white'
                    : 'scale-95 opacity-80 bg-white/70'
                }`}
              >
                {/* Vector Person Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden">
                  <div className="w-7 h-7 rounded-full bg-amber-200 mb-1 border-2 border-slate-900 flex items-center justify-center">
                    <div className="flex gap-1.5">
                      <span className="w-1 h-1 bg-slate-900 rounded-full animate-ping"></span>
                      <span className="w-1 h-1 bg-slate-900 rounded-full"></span>
                    </div>
                  </div>
                  {/* Onliner branded hoodie */}
                  <div className="w-12 h-6 bg-[#ffd300] rounded-t-md flex items-center justify-center">
                    <span className="text-[7px] font-black text-black">onlíner</span>
                  </div>
                </div>

                {scene.speaker === 'max' && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 animate-bounce">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-800 mt-1.5">Максим</span>
              <span className="text-[9px] text-slate-500">Логист</span>
            </div>

            {/* Actor 2: AI Robot */}
            <div className="flex flex-col items-center">
              <div 
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 ${
                  scene.speaker === 'bot'
                    ? 'scale-110 ring-4 ring-amber-400 bg-white animate-float'
                    : scene.sceneTheme === 'danger'
                    ? 'bg-red-50 border-2 border-red-400'
                    : 'scale-95 opacity-80 bg-white/70'
                }`}
              >
                {/* Robot Character */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center relative shadow-inner ${
                  scene.sceneTheme === 'danger'
                    ? 'bg-gradient-to-tr from-red-600 to-rose-700 text-white'
                    : scene.sceneTheme === 'success'
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-700 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-blue-700 text-white'
                }`}>
                  {/* Antenna */}
                  <div className="w-1 h-2 bg-amber-400 rounded-t-full mb-0.5"></div>
                  <Bot className="w-8 h-8" />
                  <div className="flex gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  </div>
                </div>

                {scene.sceneTheme === 'danger' && (
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 animate-ping">
                    <Flame className="w-3 h-3" />
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-800 mt-1.5">GPT-Бот</span>
              <span className="text-[9px] text-slate-500">Нейросеть</span>
            </div>

            {/* Actor 3: Elena Viktorovna (Compliance Officer) */}
            <div className="flex flex-col items-center">
              <div 
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 ${
                  scene.speaker === 'elena'
                    ? 'scale-110 ring-4 ring-emerald-500 bg-white'
                    : 'scale-95 opacity-80 bg-white/70'
                }`}
              >
                {/* Security Officer Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-xl flex flex-col items-center justify-center text-white relative">
                  <div className="w-7 h-7 rounded-full bg-rose-200 mb-1 border-2 border-slate-900 flex items-center justify-center">
                    <div className="w-5 h-2 border-t-2 border-slate-900"></div>
                  </div>
                  {/* Security badge jacket */}
                  <div className="w-12 h-6 bg-slate-700 rounded-t-md flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>

                {scene.speaker === 'elena' && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 animate-bounce">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-800 mt-1.5">Елена В.</span>
              <span className="text-[9px] text-slate-500">Комплаенс</span>
            </div>
          </div>

          {/* Traffic light visual indicators if scene 4 */}
          {scene.sceneTheme === 'traffic' && (
            <div className="flex items-center justify-center gap-4 z-10 py-1 bg-white/90 rounded-xl border border-slate-200 max-w-sm mx-auto shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                <span>🔴 Красный</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span>🟡 Желтый</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>🟢 Зеленый</span>
              </div>
            </div>
          )}
        </div>

        {/* Comic Speech Bubble Box */}
        <div className="p-5 sm:p-6 bg-white border-t border-slate-200 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scene.statusColor} bg-slate-50`}>
                {scene.speakerName}
              </span>
              <span className="text-xs text-slate-400">• {scene.speakerRole}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              {scene.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {scene.speech}
            </p>
          </div>

          {/* Controls Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Пауза' : 'Воспроизвести'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentSceneIdx(0);
                  setIsPlaying(true);
                }}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Сначала"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {currentSceneIdx < SCENES.length - 1 ? (
                <button
                  onClick={() => setCurrentSceneIdx((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow"
                >
                  <span>Следующая сцена</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onFinish}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#ffd300] hover:bg-[#f0c600] text-black text-xs font-black rounded-xl shadow-md transition transform hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Понятно! Начать обучение в Onliner</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
