import React, { useState, useEffect } from 'react';
import { 
  interactiveExamQuestions, 
  InteractiveQuestion 
} from '../data/interactiveExamData';
import { EmployeeInfo } from './ExamRegistration';
import { 
  Clock, 
  ArrowRight, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles,
  Layers,
  EyeOff,
  MoveUp,
  MoveDown,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface ExamInteractiveViewProps {
  employeeInfo: EmployeeInfo;
  onFinishExam: (results: {
    answers: Record<number, any>;
    score: number;
    total: number;
    questionResults: { id: number; isCorrect: boolean; userAns: any }[];
    timeSpentSeconds: number;
  }) => void;
  onQuit: () => void;
}

export const ExamInteractiveView: React.FC<ExamInteractiveViewProps> = ({
  employeeInfo,
  onFinishExam,
  onQuit,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Dynamic user answers state per question
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});

  // Question evaluations tracking
  const [questionResults, setQuestionResults] = useState<{ id: number; isCorrect: boolean; userAns: any }[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalQuestions = interactiveExamQuestions.length; // 10
  const currentQ: InteractiveQuestion = interactiveExamQuestions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper getters & setters for specific question types
  const getCurrentAnswer = () => userAnswers[currentQ.id];

  const updateCurrentAnswer = (val: any) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  // Validate if user has provided complete input for current question
  const isAnswerValid = (): boolean => {
    const ans = getCurrentAnswer();
    if (!ans) return false;

    switch (currentQ.type) {
      case 'redaction':
        // Expect at least 1 redacted token
        return Array.isArray(ans) && ans.length > 0;
      case 'zone_sorting':
        // Expect all 3 items to have assigned zones
        return (
          ans &&
          currentQ.zoneItems?.every((item) => ans[item.id] !== undefined)
        );
      case 'injection_spot':
        return typeof ans === 'string';
      case 'step_ordering':
        return Array.isArray(ans) && ans.length === 4;
      case 'multi_audit':
        return Array.isArray(ans) && ans.length > 0;
      case 'sanctions_eval':
        return Array.isArray(ans) && ans.length > 0;
      case 'prompt_builder':
        return Array.isArray(ans) && ans.length > 0;
      case 'customs_gate':
        return Array.isArray(ans) && ans.length > 0;
      case 'switchboard':
        return (
          ans &&
          currentQ.switchboardItems?.every((item) => ans[item.id] !== undefined)
        );
      case 'phish_audit':
        return Array.isArray(ans) && ans.length > 0;
      default:
        return false;
    }
  };

  // Evaluate whether the answer is 100% correct
  const evaluateQuestion = (q: InteractiveQuestion, ans: any): boolean => {
    if (!ans) return false;

    switch (q.type) {
      case 'redaction': {
        const sensitiveIds = q.redactionTokens?.filter((t) => t.isSensitive).map((t) => t.id) || [];
        const nonSensitiveIds = q.redactionTokens?.filter((t) => !t.isSensitive).map((t) => t.id) || [];
        const selectedIds: string[] = ans || [];
        const foundAllSensitive = sensitiveIds.every((id) => selectedIds.includes(id));
        const noNonSensitive = !nonSensitiveIds.some((id) => selectedIds.includes(id));
        return foundAllSensitive && noNonSensitive;
      }
      case 'zone_sorting': {
        return (
          q.zoneItems?.every((item) => ans[item.id] === item.correctZone) || false
        );
      }
      case 'injection_spot': {
        const correctP = q.injectionParagraphs?.find((p) => p.isInjection);
        return correctP ? ans === correctP.id : false;
      }
      case 'step_ordering': {
        // ans is array of IDs in order
        const correctIdsInOrder = [...(q.orderSteps || [])]
          .sort((a, b) => a.correctOrder - b.correctOrder)
          .map((s) => s.id);
        return JSON.stringify(ans) === JSON.stringify(correctIdsInOrder);
      }
      case 'multi_audit': {
        const correctIds = q.multiAuditOptions?.filter((o) => o.isCorrect).map((o) => o.id) || [];
        const incorrectIds = q.multiAuditOptions?.filter((o) => !o.isCorrect).map((o) => o.id) || [];
        const selectedIds: string[] = ans || [];
        const allCorrect = correctIds.every((id) => selectedIds.includes(id));
        const noIncorrect = !incorrectIds.some((id) => selectedIds.includes(id));
        return allCorrect && noIncorrect;
      }
      case 'sanctions_eval': {
        const officialIds = q.sanctionsOptions?.filter((o) => o.isOfficial).map((o) => o.id) || [];
        const nonOfficialIds = q.sanctionsOptions?.filter((o) => !o.isOfficial).map((o) => o.id) || [];
        const selectedIds: string[] = ans || [];
        return (
          officialIds.every((id) => selectedIds.includes(id)) &&
          !nonOfficialIds.some((id) => selectedIds.includes(id))
        );
      }
      case 'prompt_builder': {
        const safeIds = q.promptBlocks?.filter((b) => b.isSafe).map((b) => b.id) || [];
        const unsafeIds = q.promptBlocks?.filter((b) => !b.isSafe).map((b) => b.id) || [];
        const selectedIds: string[] = ans || [];
        return (
          safeIds.every((id) => selectedIds.includes(id)) &&
          !unsafeIds.some((id) => selectedIds.includes(id))
        );
      }
      case 'customs_gate': {
        const requiredIds = q.customsChecklist?.filter((c) => c.isRequired).map((c) => c.id) || [];
        const nonRequiredIds = q.customsChecklist?.filter((c) => !c.isRequired).map((c) => c.id) || [];
        const selectedIds: string[] = ans || [];
        return (
          requiredIds.every((id) => selectedIds.includes(id)) &&
          !nonRequiredIds.some((id) => selectedIds.includes(id))
        );
      }
      case 'switchboard': {
        return (
          q.switchboardItems?.every((item) => ans[item.id] === item.shouldBlock) || false
        );
      }
      case 'phish_audit': {
        const threatIds = q.phishIndicators?.filter((p) => p.isThreat).map((p) => p.id) || [];
        const nonThreatIds = q.phishIndicators?.filter((p) => !p.isThreat).map((p) => p.id) || [];
        const selectedIds: string[] = ans || [];
        return (
          threatIds.every((id) => selectedIds.includes(id)) &&
          !nonThreatIds.some((id) => selectedIds.includes(id))
        );
      }
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isAnswerValid()) return;

    const currentAns = getCurrentAnswer();
    const isCorrect = evaluateQuestion(currentQ, currentAns);

    const newResults = [
      ...questionResults.filter((r) => r.id !== currentQ.id),
      { id: currentQ.id, isCorrect, userAns: currentAns },
    ];
    setQuestionResults(newResults);

    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Completed all 10 interactive questions
      const finalScore = newResults.filter((r) => r.isCorrect).length;
      onFinishExam({
        answers: userAnswers,
        score: finalScore,
        total: totalQuestions,
        questionResults: newResults,
        timeSpentSeconds,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Status & Timer Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffd300] flex items-center justify-center text-black font-black text-sm shadow-sm">
            on
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{employeeInfo.fullName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                {employeeInfo.department}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Аттестация Onliner: Интерактивный аудит безопасности
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-slate-800">
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{formatTimer(timeSpentSeconds)}</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Прервать экзамен? Прогресс будет сброшен.')) {
                onQuit();
              }
            }}
            className="text-xs font-semibold text-slate-400 hover:text-red-600 transition"
          >
            Прервать
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Интерактивный кейс <strong className="text-slate-900 font-mono">{currentIdx + 1}</strong> из {totalQuestions}
          </span>
          <span className="font-mono font-bold text-amber-600">{progressPercent}% пройдено</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-[#ffd300] to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl relative">
        {/* Category Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffd300]"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {currentQ.categoryLabel}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">ID: #{currentQ.id}</span>
        </div>

        {/* Title & Persona */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentQ.personName} • {currentQ.personRole}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {currentQ.title}
          </h2>
        </div>

        {/* Situation Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Контекст инцидента в Onliner:
          </div>
          {currentQ.situation}
        </div>

        {/* Instruction Banner */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-900 text-xs sm:text-sm font-semibold mb-6 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{currentQ.instruction}</span>
        </div>

        {/* INTERACTIVE WORKSPACE PER TYPE */}
        <div className="py-2">
          {/* 1. REDACTION */}
          {currentQ.type === 'redaction' && currentQ.redactionTokens && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>Кликайте по фрагментам для маскирования [СКРЫТО]:</span>
                <span className="font-bold text-slate-800 font-mono">
                  Замаскировано: {(getCurrentAnswer() || []).length} / 4
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 font-mono text-xs sm:text-sm leading-loose flex flex-wrap gap-2.5">
                {currentQ.redactionTokens.map((token) => {
                  const isRedacted = (getCurrentAnswer() || []).includes(token.id);
                  return (
                    <button
                      key={token.id}
                      type="button"
                      onClick={() => {
                        const currentList: string[] = getCurrentAnswer() || [];
                        const nextList = isRedacted
                          ? currentList.filter((id) => id !== token.id)
                          : [...currentList, token.id];
                        updateCurrentAnswer(nextList);
                      }}
                      className={`px-3 py-2 rounded-xl transition font-sans text-xs font-semibold cursor-pointer border ${
                        isRedacted
                          ? 'bg-slate-900 text-amber-300 border-black shadow-inner flex items-center gap-1.5'
                          : 'bg-white text-slate-800 hover:bg-amber-50 border-slate-300 hover:border-amber-400 shadow-sm'
                      }`}
                    >
                      {isRedacted ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                          <span>[ЗАМАСКИРОВАНО ДЛЯ ИИ]</span>
                        </>
                      ) : (
                        <span>{token.text}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. ZONE SORTING */}
          {currentQ.type === 'zone_sorting' && currentQ.zoneItems && (
            <div className="space-y-4">
              {currentQ.zoneItems.map((item, idx) => {
                const assigned = (getCurrentAnswer() || {})[item.id];
                return (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-sm font-semibold text-slate-800 flex items-start gap-2">
                      <span className="font-bold text-slate-400 font-mono">{idx + 1}.</span>
                      <span>{item.text}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentObj = getCurrentAnswer() || {};
                          updateCurrentAnswer({ ...currentObj, [item.id]: 'red' });
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          assigned === 'red'
                            ? 'bg-red-500 text-white border-red-600 shadow-md'
                            : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                        }`}
                      >
                        🔴 Красная зона
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const currentObj = getCurrentAnswer() || {};
                          updateCurrentAnswer({ ...currentObj, [item.id]: 'yellow' });
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          assigned === 'yellow'
                            ? 'bg-amber-400 text-black border-amber-500 shadow-md'
                            : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                        }`}
                      >
                        🟡 Желтая зона
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const currentObj = getCurrentAnswer() || {};
                          updateCurrentAnswer({ ...currentObj, [item.id]: 'green' });
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          assigned === 'green'
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                            : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        🟢 Зеленая зона
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. PROMPT INJECTION SPOTTER */}
          {currentQ.type === 'injection_spot' && currentQ.injectionParagraphs && (
            <div className="space-y-3">
              {currentQ.injectionParagraphs.map((p, idx) => {
                const isSelected = getCurrentAnswer() === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => updateCurrentAnswer(p.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-400'
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="text-xs sm:text-sm font-mono text-slate-800 leading-relaxed">
                        {p.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. STEP ORDERING */}
          {currentQ.type === 'step_ordering' && currentQ.orderSteps && (
            <div className="space-y-2.5">
              {(() => {
                const stepOrder: string[] = getCurrentAnswer() || currentQ.orderSteps.map((s) => s.id);
                // Ensure initial state
                if (!getCurrentAnswer()) {
                  setTimeout(() => updateCurrentAnswer(stepOrder), 0);
                }

                return stepOrder.map((stepId, index) => {
                  const step = currentQ.orderSteps?.find((s) => s.id === stepId);
                  if (!step) return null;

                  const handleMoveUp = () => {
                    if (index === 0) return;
                    const newArr = [...stepOrder];
                    const temp = newArr[index - 1];
                    newArr[index - 1] = newArr[index];
                    newArr[index] = temp;
                    updateCurrentAnswer(newArr);
                  };

                  const handleMoveDown = () => {
                    if (index === stepOrder.length - 1) return;
                    const newArr = [...stepOrder];
                    const temp = newArr[index + 1];
                    newArr[index + 1] = newArr[index];
                    newArr[index] = temp;
                    updateCurrentAnswer(newArr);
                  };

                  return (
                    <div
                      key={step.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 shadow-sm hover:bg-white transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-[#ffd300] text-black font-black text-xs flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                          {step.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={handleMoveUp}
                          className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-30 transition"
                          title="Поднять выше"
                        >
                          <MoveUp className="w-4 h-4 text-slate-700" />
                        </button>
                        <button
                          type="button"
                          disabled={index === stepOrder.length - 1}
                          onClick={handleMoveDown}
                          className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-30 transition"
                          title="Опустить ниже"
                        >
                          <MoveDown className="w-4 h-4 text-slate-700" />
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* 5. MULTI AUDIT */}
          {currentQ.type === 'multi_audit' && currentQ.multiAuditOptions && (
            <div className="space-y-2.5">
              {currentQ.multiAuditOptions.map((opt) => {
                const selectedList: string[] = getCurrentAnswer() || [];
                const isSelected = selectedList.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      const next = isSelected
                        ? selectedList.filter((id) => id !== opt.id)
                        : [...selectedList, opt.id];
                      updateCurrentAnswer(next);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      {opt.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 6. SANCTIONS EVALUATION */}
          {currentQ.type === 'sanctions_eval' && currentQ.sanctionsOptions && (
            <div className="space-y-2.5">
              {currentQ.sanctionsOptions.map((opt) => {
                const selectedList: string[] = getCurrentAnswer() || [];
                const isSelected = selectedList.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      const next = isSelected
                        ? selectedList.filter((id) => id !== opt.id)
                        : [...selectedList, opt.id];
                      updateCurrentAnswer(next);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-400 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      {opt.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 7. PROMPT BUILDER */}
          {currentQ.type === 'prompt_builder' && currentQ.promptBlocks && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQ.promptBlocks.map((block) => {
                  const selectedList: string[] = getCurrentAnswer() || [];
                  const isSelected = selectedList.includes(block.id);

                  return (
                    <div
                      key={block.id}
                      onClick={() => {
                        const next = isSelected
                          ? selectedList.filter((id) => id !== block.id)
                          : [...selectedList, block.id];
                        updateCurrentAnswer(next);
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400'
                          : 'bg-slate-50 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="text-xs font-semibold text-slate-800 mb-2 leading-relaxed">
                        {block.text}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-400">{block.category}</span>
                        <span className={isSelected ? 'text-emerald-700' : 'text-slate-500'}>
                          {isSelected ? '✓ Включен в промт' : '+ Добавить'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Assembled prompt preview */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs font-mono">
                <div className="text-[10px] text-[#ffd300] font-bold uppercase tracking-wider mb-1">
                  Предпросмотр собираемого промта:
                </div>
                <div className="leading-relaxed">
                  {(getCurrentAnswer() || []).length === 0 ? (
                    <span className="text-slate-500 italic">Нажмите на блоки выше, чтобы добавить их в промт...</span>
                  ) : (
                    currentQ.promptBlocks
                      .filter((b) => (getCurrentAnswer() || []).includes(b.id))
                      .map((b) => b.text)
                      .join(' ')
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 8. CUSTOMS GATE */}
          {currentQ.type === 'customs_gate' && currentQ.customsChecklist && (
            <div className="space-y-2.5">
              {currentQ.customsChecklist.map((item) => {
                const selectedList: string[] = getCurrentAnswer() || [];
                const isSelected = selectedList.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      const next = isSelected
                        ? selectedList.filter((id) => id !== item.id)
                        : [...selectedList, item.id];
                      updateCurrentAnswer(next);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      {item.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 9. SWITCHBOARD */}
          {currentQ.type === 'switchboard' && currentQ.switchboardItems && (
            <div className="space-y-3">
              {currentQ.switchboardItems.map((item) => {
                const isBlocked = (getCurrentAnswer() || {})[item.id];
                const hasValue = isBlocked !== undefined;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.detail}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const curr = getCurrentAnswer() || {};
                          updateCurrentAnswer({ ...curr, [item.id]: false });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                          hasValue && !isBlocked
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        🟢 Разрешить
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const curr = getCurrentAnswer() || {};
                          updateCurrentAnswer({ ...curr, [item.id]: true });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                          hasValue && isBlocked
                            ? 'bg-red-500 text-white border-red-600 shadow'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        🔴 Заблокировать
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 10. PHISH AUDIT */}
          {currentQ.type === 'phish_audit' && currentQ.phishIndicators && (
            <div className="space-y-2.5">
              {currentQ.phishIndicators.map((ind) => {
                const selectedList: string[] = getCurrentAnswer() || [];
                const isSelected = selectedList.includes(ind.id);

                return (
                  <div
                    key={ind.id}
                    onClick={() => {
                      const next = isSelected
                        ? selectedList.filter((id) => id !== ind.id)
                        : [...selectedList, ind.id];
                      updateCurrentAnswer(next);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-red-50 border-red-500 shadow-sm ring-2 ring-red-400'
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 rounded text-red-500 focus:ring-red-400 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      {ind.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer & Submit Navigation */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 italic">
            Интерактивный формат Onliner: случайное угадывание исключено.
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isAnswerValid()}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition shadow-lg ${
              isAnswerValid()
                ? 'bg-[#ffd300] hover:bg-[#f0c600] text-black shadow-amber-500/20 cursor-pointer transform hover:-translate-y-0.5'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <span>{currentIdx < totalQuestions - 1 ? 'Зафиксировать и далее' : 'Завершить экзамен'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
