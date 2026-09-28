import React from 'react';
import { ShieldCheck, BookOpen, Target, Award, Film } from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'practice' | 'exam';
  onNavigate: (view: 'dashboard' | 'practice' | 'exam') => void;
  onOpenTrafficLight: () => void;
  onOpenCartoon: () => void;
  examInProgress?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenTrafficLight,
  onOpenCartoon,
  examInProgress = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all no-print shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Onliner Brand */}
          <div 
            onClick={() => !examInProgress && onNavigate('dashboard')}
            className={`flex items-center gap-3 ${examInProgress ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-90 transition-opacity'}`}
          >
            {/* Iconic Onliner Yellow Badge */}
            <div className="flex items-center gap-1.5 bg-[#ffd300] px-3 py-1.5 rounded-xl shadow-sm border border-amber-400">
              <span className="font-black text-lg tracking-tighter text-black font-sans">
                onlíner
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#ffd300] px-1.5 py-0.5 rounded">
                AI
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Безопасный ИИ в логистике и ВЭД
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                ООО «ОНЛАЙНЕР» • Комплаенс и защита данных
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cartoon Button */}
            <button
              onClick={onOpenCartoon}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition shadow-sm"
              title="Посмотреть мультфильм про ИИ-безопасность"
            >
              <Film className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Мультик</span> Onliner
            </button>

            {/* Traffic Light Modal */}
            <button
              onClick={onOpenTrafficLight}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
              title="Открыть регламент «Светофор безопасности»"
            >
              <BookOpen className="w-4 h-4 text-slate-700" />
              <span className="hidden md:inline">Справочник</span> «Светофор»
            </button>

            {!examInProgress && (
              <>
                <button
                  onClick={() => onNavigate('practice')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                    currentView === 'practice'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Target className="w-4 h-4 text-amber-400" />
                  <span>Кейсы</span>
                </button>

                <button
                  onClick={() => onNavigate('exam')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                    currentView === 'exam'
                      ? 'bg-[#ffd300] text-black shadow-md border border-amber-400'
                      : 'bg-slate-100 text-slate-800 hover:bg-[#ffd300]/80'
                  }`}
                >
                  <Award className="w-4 h-4 text-slate-900" />
                  <span>Экзамен</span>
                </button>
              </>
            )}

            {examInProgress && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>ИДЕТ ЭКЗАМЕН</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
