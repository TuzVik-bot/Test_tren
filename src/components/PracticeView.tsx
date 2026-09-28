import React, { useState } from 'react';
import { practiceCases, PracticeCase, PracticeOption } from '../data/practiceCases';
import { categoryLabels } from '../data/examData';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Briefcase, 
  FileText, 
  Clock, 
  Info,
  Layers,
  UserCheck
} from 'lucide-react';

interface PracticeViewProps {
  onOpenTrafficLight: () => void;
  onGoToExam: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ onOpenTrafficLight, onGoToExam }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<PracticeOption | null>(null);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  const filteredCases = practiceCases.filter((c) => 
    selectedCategory === 'all' || c.category === selectedCategory
  );

  const currentCase: PracticeCase | undefined = filteredCases[currentCaseIndex % Math.max(1, filteredCases.length)];

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentCaseIndex(0);
    setSelectedOption(null);
  };

  const handleSelectOption = (opt: PracticeOption) => {
    setSelectedOption(opt);
    if (!selectedOption) {
      setSolvedCount((prev) => prev + 1);
    }
  };

  const handleNextCase = () => {
    setSelectedOption(null);
    setCurrentCaseIndex((prev) => (prev + 1) % filteredCases.length);
  };

  const handleResetChoice = () => {
    setSelectedOption(null);
  };

  if (!currentCase) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">В данной категории нет доступных кейсов.</p>
      </div>
    );
  }

  const categoryMeta = categoryLabels[currentCase.category];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#ffd300] text-black">
              Кейсы Onliner
            </span>
            <span className="text-xs text-slate-500 font-mono font-semibold">
              Ситуация {currentCaseIndex + 1} из {filteredCases.length}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Тренажер реальных инцидентов</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-medium">
            Разобрано ситуаций: <span className="font-bold text-emerald-600 font-mono">{solvedCount}</span>
          </div>
          <button
            onClick={onOpenTrafficLight}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Светофор</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 text-xs shadow-sm">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow'
              : 'text-slate-600 hover:text-black hover:bg-slate-100'
          }`}
        >
          Все кейсы ({practiceCases.length})
        </button>
        {Object.entries(categoryLabels).map(([catKey, info]) => {
          const count = practiceCases.filter((c) => c.category === catKey).length;
          const isActive = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => handleCategoryChange(catKey)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#ffd300] text-black border border-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              <span>{info.label}</span>
              <span className="text-[10px] px-1 rounded bg-black/10 text-slate-800 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Incident Case Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Category & Persona Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffd300]"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {categoryMeta.label}
            </span>
          </div>

          <span className="text-xs text-slate-400 font-mono font-medium">ID: {currentCase.id}</span>
        </div>

        {/* Persona Identity Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 mb-4">
          <div className="text-2xl">{currentCase.personAvatar}</div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>{currentCase.personName}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900">
                Onliner
              </span>
            </div>
            <div className="text-xs text-slate-600">{currentCase.personRole}</div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
          {currentCase.title}
        </h2>

        {/* Operational Context Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="truncate">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Роль в Onliner</div>
              <div className="text-xs font-semibold text-slate-800 truncate">{currentCase.context.role}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="truncate">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Документ / Данные</div>
              <div className="text-xs font-semibold text-slate-800 truncate">{currentCase.context.document}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600 shrink-0" />
            <div className="truncate">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Срочность</div>
              <div className="text-xs font-semibold text-slate-800 truncate">{currentCase.context.urgency}</div>
            </div>
          </div>
        </div>

        {/* Situation Description Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed font-normal">
          <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>Ситуация в операционном отделе Onliner:</span>
          </div>
          {currentCase.context.description}
        </div>

        {/* Options */}
        <div className="mt-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Выберите ваше решение как сотрудника компании:
          </div>

          {currentCase.options.map((option, idx) => {
            const isSelected = selectedOption?.id === option.id;
            let buttonStyle = 'bg-white border-slate-200 hover:border-slate-400 text-slate-800';

            if (selectedOption) {
              if (isSelected) {
                if (option.status === 'safe') {
                  buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md ring-2 ring-emerald-400';
                } else if (option.status === 'danger') {
                  buttonStyle = 'bg-red-50 border-red-500 text-red-950 shadow-md ring-2 ring-red-400';
                } else {
                  buttonStyle = 'bg-amber-50 border-amber-500 text-amber-950 shadow-md ring-2 ring-amber-400';
                }
              } else {
                buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                disabled={Boolean(selectedOption)}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${buttonStyle} ${
                  !selectedOption ? 'cursor-pointer hover:bg-slate-50 hover:scale-[1.005]' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected
                      ? option.status === 'safe'
                        ? 'bg-emerald-600 text-white'
                        : option.status === 'danger'
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-500 text-black'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>

                <div className="flex-1 text-sm font-medium leading-relaxed">{option.text}</div>
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Debrief Card */}
        {selectedOption && (
          <div
            className={`mt-6 rounded-2xl border p-5 transition-all animate-fadeIn ${
              selectedOption.status === 'safe'
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : selectedOption.status === 'danger'
                ? 'bg-red-50/80 border-red-300 text-red-950'
                : 'bg-amber-50/80 border-amber-300 text-amber-950'
            }`}
          >
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/10 mb-3">
              <div className="flex items-center gap-2.5">
                {selectedOption.status === 'safe' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : selectedOption.status === 'danger' ? (
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <span className="font-bold text-base text-slate-900">
                  {selectedOption.title}
                </span>
              </div>

              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                  selectedOption.status === 'safe'
                    ? 'bg-emerald-600 text-white'
                    : selectedOption.status === 'danger'
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-500 text-black'
                }`}
              >
                {selectedOption.status === 'safe'
                  ? 'Безопасно'
                  : selectedOption.status === 'danger'
                  ? 'Критический риск'
                  : 'Частичная ошибка'}
              </span>
            </div>

            {/* Explanation */}
            <p className="text-sm leading-relaxed mb-3 text-slate-800">
              {selectedOption.explanation}
            </p>

            {/* Violated Rule */}
            {selectedOption.ruleViolated && (
              <div className="text-xs bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 mb-3 flex items-start gap-2 shadow-sm">
                <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Регламент Onliner: </strong>
                  {selectedOption.ruleViolated}
                </div>
              </div>
            )}

            {/* Safe Standard Operating Procedure */}
            <div className="text-xs bg-white p-3 rounded-xl border border-emerald-200 text-emerald-950 flex items-start gap-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-800">Стандарт безопасности Onliner (SOP): </strong>
                {selectedOption.correctRecommendation}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleResetChoice}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-black bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Попробовать другой вариант</span>
              </button>

              <button
                onClick={handleNextCase}
                className="flex items-center gap-2 px-5 py-2 text-xs font-black rounded-xl bg-slate-900 hover:bg-black text-white shadow-md transition"
              >
                <span>Следующий кейс</span>
                <ArrowRight className="w-4 h-4 text-[#ffd300]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="rounded-3xl bg-amber-50 border border-amber-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Готовы к официальному экзамену Onliner?</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            10 интерактивных испытаний без случайного угадывания. Проверьте вашу комплаенс-готовность!
          </p>
        </div>
        <button
          onClick={onGoToExam}
          className="px-5 py-2.5 bg-[#ffd300] hover:bg-[#f0c600] text-black font-black text-xs rounded-xl border border-amber-400 shadow-sm transition shrink-0"
        >
          Сдать интерактивный экзамен
        </button>
      </div>
    </div>
  );
};
