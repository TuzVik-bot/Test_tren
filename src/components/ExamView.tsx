import React, { useState, useEffect } from 'react';
import { examQuestions, ExamQuestion, categoryLabels } from '../data/examData';
import { EmployeeInfo } from './ExamRegistration';
import { Clock, ShieldAlert, ArrowRight, CheckCircle2, User, Building2 } from 'lucide-react';

interface ExamViewProps {
  employeeInfo: EmployeeInfo;
  onFinishExam: (results: {
    answers: Record<number, number>;
    timeSpentSeconds: number;
  }) => void;
  onQuit: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  employeeInfo,
  onFinishExam,
  onQuit,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQ: ExamQuestion = examQuestions[currentIdx];
  const selectedOptionIdx = answers[currentQ.id];
  const totalQuestions = examQuestions.length;
  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (idx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: idx,
    }));
  };

  const handleNext = () => {
    if (selectedOptionIdx === undefined) return;

    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Completed all 30 questions
      onFinishExam({
        answers,
        timeSpentSeconds,
      });
    }
  };

  const categoryMeta = categoryLabels[currentQ.category];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Status & Timer Bar */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{employeeInfo.fullName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                {employeeInfo.department}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Официальный экзамен комплаенса
            </div>
          </div>
        </div>

        {/* Timer & Question Counter */}
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-amber-300">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{formatTimer(timeSpentSeconds)}</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Вы действительно хотите прервать экзамен? Текущий прогресс будет сброшен.')) {
                onQuit();
              }
            }}
            className="text-xs text-slate-500 hover:text-rose-400 transition"
          >
            Прервать
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">
            Вопрос <strong className="text-white font-mono">{currentIdx + 1}</strong> из {totalQuestions}
          </span>
          <span className="font-mono text-emerald-400">{progressPercent}% пройдено</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
        {/* Category Pill */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {categoryMeta.label}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {currentIdx + 1}/{totalQuestions}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">
          {currentQ.q}
        </h2>

        {/* 4 Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOptionIdx === optIdx;

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 text-white shadow-md shadow-blue-950/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-blue-500 text-white font-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </div>

                <div className="flex-1 text-sm leading-relaxed">{option}</div>
              </div>
            );
          })}
        </div>

        {/* Next / Submit Button */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 italic">
            Во время экзамена подсказки отключены. Ответ фиксируется в протоколе.
          </div>

          <button
            onClick={handleNext}
            disabled={selectedOptionIdx === undefined}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg ${
              selectedOptionIdx !== undefined
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 cursor-pointer transform hover:-translate-y-0.5'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <span>{currentIdx < totalQuestions - 1 ? 'Далее' : 'Завершить экзамен'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
