import React, { useState } from 'react';
import { interactiveExamQuestions, InteractiveQuestion } from '../data/interactiveExamData';
import { EmployeeInfo } from './ExamRegistration';
import { 
  generateVerificationHash, 
  formatReportText, 
  formatReportJson 
} from '../utils/securityHash';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  Printer, 
  Send, 
  RotateCcw, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  QrCode,
  FileSpreadsheet,
  Building2
} from 'lucide-react';

interface ExamResultViewProps {
  employeeInfo: EmployeeInfo;
  score: number;
  total: number;
  questionResults: { id: number; isCorrect: boolean; userAns: any }[];
  timeSpentSeconds: number;
  onRetake: () => void;
  onGoHome: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  employeeInfo,
  score,
  total,
  questionResults,
  timeSpentSeconds,
  onRetake,
  onGoHome,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [webhookMessage, setWebhookMessage] = useState('');
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 80; // 8 out of 10 or higher
  const examDate = new Date();
  const dateStr = examDate.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const verificationHash = generateVerificationHash(
    employeeInfo.fullName,
    employeeInfo.department,
    employeeInfo.email,
    score,
    total,
    dateStr
  );

  // Group performance by categories
  const categoryStats: Record<string, { correct: number; total: number; label: string }> = {};

  interactiveExamQuestions.forEach((q) => {
    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { correct: 0, total: 0, label: q.categoryLabel };
    }
    categoryStats[q.category].total += 1;
    const res = questionResults.find((r) => r.id === q.id);
    if (res?.isCorrect) {
      categoryStats[q.category].correct += 1;
    }
  });

  const categoryScoresFormatted = Object.entries(categoryStats).reduce(
    (acc, [key, stat]) => {
      acc[key] = {
        correct: stat.correct,
        total: stat.total,
        percent: Math.round((stat.correct / stat.total) * 100),
        label: stat.label,
      };
      return acc;
    },
    {} as Record<string, { correct: number; total: number; percent: number; label: string }>
  );

  const handleCopyTextReport = () => {
    const report = `=====================================================
ОФИЦИАЛЬНЫЙ АТТЕСТАЦИОННЫЙ ПРОТОКОЛ ООО «ОНЛАЙНЕР»
«Безопасный ИИ в логистике и ВЭД» (УНП 190635942)
=====================================================
Сотрудник: ${employeeInfo.fullName}
Подразделение: ${employeeInfo.department}
E-mail: ${employeeInfo.email}
Дата аттестации: ${dateStr}
Время выполнения: ${Math.floor(timeSpentSeconds / 60)} мин ${timeSpentSeconds % 60} сек
-----------------------------------------------------
РЕЗУЛЬТАТ: ${score} из ${total} (${percentage}%)
ВЕРДИКТ: ${passed ? '✅ АТТЕСТОВАН (СДАН)' : '❌ НЕ АТТЕСТОВАН (< 80%)'}
Порог сдачи: 80% (минимум 8 из 10 интерактивных кейсов)
-----------------------------------------------------
КРИПТОГРАФИЧЕСКИЙ ХЕШ ВЕРИФИКАЦИИ РУКОВОДИТЕЛЯ:
${verificationHash}
(Защищен от модификации данных сотрудника)
=====================================================`;

    navigator.clipboard.writeText(report);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyJsonReport = () => {
    const jsonStr = formatReportJson({
      fullName: employeeInfo.fullName,
      department: employeeInfo.department,
      email: employeeInfo.email,
      score,
      total,
      passed,
      timeSpentSeconds,
      verificationHash,
      categoryScores: categoryScoresFormatted,
      dateStr,
    });

    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendWebhook = async () => {
    if (!webhookUrl.trim()) {
      alert('Укажите URL вебхука Google Sheets или ERP.');
      return;
    }

    setWebhookStatus('sending');
    setWebhookMessage('');

    const payload = {
      company: 'ООО ОНЛАЙНЕР',
      unp: '190635942',
      timestamp: dateStr,
      employeeName: employeeInfo.fullName,
      department: employeeInfo.department,
      email: employeeInfo.email,
      score: `${score}/${total}`,
      percentage: `${percentage}%`,
      verdict: passed ? 'СДАН' : 'НЕ СДАН',
      verificationHash,
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors',
      });
      setWebhookStatus('success');
      setWebhookMessage('Данные успешно переданы в Google Sheets Onliner!');
    } catch (err: any) {
      setWebhookStatus('error');
      setWebhookMessage(`Ошибка отправки: ${err?.message || 'Сетевая ошибка'}`);
    }
  };

  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Printable Certificate (Visible on Screen & in PDF Print) */}
      <div className="certificate-print-card bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden text-slate-900">
        {/* Onliner Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-center select-none font-black text-9xl">
          onlíner
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-black text-[#ffd300] font-black text-sm px-2 py-0.5 rounded tracking-tighter">
                onlíner
              </span>
              <span className="text-xs font-black tracking-widest text-slate-500 uppercase font-mono">
                ООО «ОНЛАЙНЕР» • УНП 190635942
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {passed ? 'Официальный сертификат аттестации' : 'Протокол прохождения аттестации'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Программа: «Безопасный ИИ в логистике, ВЭД и таможенном декларировании»
            </p>
          </div>

          {/* Stamp / Verdict badge */}
          <div className="shrink-0 self-start sm:self-auto">
            {passed ? (
              <div className="px-5 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 flex items-center gap-2.5 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Вердикт Onliner</div>
                  <div className="text-base font-black text-emerald-950">АТТЕСТОВАН (СДАН)</div>
                </div>
              </div>
            ) : (
              <div className="px-5 py-2.5 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 flex items-center gap-2.5 shadow-sm">
                <XCircle className="w-6 h-6 text-red-600" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-700">Вердикт Onliner</div>
                  <div className="text-base font-black text-red-950">НЕ СДАН (&lt; 80%)</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Сотрудник</div>
            <div className="text-sm font-bold text-slate-900 truncate">{employeeInfo.fullName}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Подразделение</div>
            <div className="text-sm font-semibold text-slate-700 truncate">{employeeInfo.department}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Результат</div>
            <div className={`text-base font-black font-mono ${passed ? 'text-emerald-700' : 'text-red-600'}`}>
              {score} / {total} ({percentage}%)
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Время и дата</div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">
              {minutes}м {seconds}с • {dateStr}
            </div>
          </div>
        </div>

        {/* Category Breakdown Bars */}
        <div className="mt-8 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Оценка компетенций по направлениям комплаенса Onliner:
          </h2>

          <div className="space-y-3">
            {Object.entries(categoryScoresFormatted).map(([key, data]) => {
              const isHigh = data.percent >= 80;
              const isMed = data.percent >= 50 && data.percent < 80;

              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{data.label}</span>
                    <span className="font-mono text-slate-500">
                      {data.correct} из {data.total} ({data.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHigh
                          ? 'bg-emerald-500'
                          : isMed
                          ? 'bg-amber-400'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${data.percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Code Box */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Криптографический хеш верификации руководителя:
              </div>
              <div className="text-xs sm:text-sm font-black font-mono text-slate-900 tracking-wider select-all">
                {verificationHash}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Защита от фальсификации. Сформирован на базе протокола интерактивных ответов Onliner.
              </div>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-600 sm:border-l sm:border-slate-200 sm:pl-4">
            <div className="font-bold text-slate-900">Служба безопасности ООО «ОНЛАЙНЕР»</div>
            <div className="text-slate-500 mt-0.5">г. Минск, пр-т Дзержинского, 5, оф. 303</div>
          </div>
        </div>
      </div>

      {/* Action Buttons for Manager & Employee (Hidden in Print) */}
      <div className="no-print space-y-6">
        {/* Buttons Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleCopyTextReport}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-2xl border border-slate-300 transition shadow-sm"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copiedText ? 'Скопировано!' : 'Скопировать отчет (Текст)'}</span>
          </button>

          <button
            onClick={handleCopyJsonReport}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-2xl border border-slate-300 transition shadow-sm"
          >
            {copiedJson ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copiedJson ? 'Скопировано JSON!' : 'Скопировать отчет (JSON)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#ffd300] hover:bg-[#f0c600] text-black font-black text-xs sm:text-sm rounded-2xl border border-amber-400 shadow-sm transition transform hover:-translate-y-0.5"
          >
            <Printer className="w-4 h-4" />
            <span>Печать в PDF / Сертификат</span>
          </button>
        </div>

        {/* Webhook Google Sheets integration card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Прямая отправка в Google Sheets Onliner
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Вставьте Webhook URL (Google Apps Script, Make или Zapier) для автоматической фиксации результатов сотрудника в кадровой таблице Onliner:
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition font-mono"
            />
            <button
              onClick={handleSendWebhook}
              disabled={webhookStatus === 'sending'}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition shadow"
            >
              <Send className="w-3.5 h-3.5 text-[#ffd300]" />
              <span>{webhookStatus === 'sending' ? 'Отправка...' : 'Отправить в таблицу'}</span>
            </button>
          </div>

          {webhookMessage && (
            <div
              className={`mt-2 text-xs font-semibold ${
                webhookStatus === 'success' ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {webhookMessage}
            </div>
          )}
        </div>

        {/* Toggle Detailed Review */}
        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <button
            onClick={() => setShowDetailedReview(!showDetailedReview)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                Подробный разбор 10 интерактивных кейсов
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                {score} верно / {total - score} ошибок
              </span>
            </div>
            {showDetailedReview ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>

          {showDetailedReview && (
            <div className="p-4 sm:p-6 border-t border-slate-100 space-y-4 max-h-[600px] overflow-y-auto">
              {interactiveExamQuestions.map((q) => {
                const res = questionResults.find((r) => r.id === q.id);
                const isCorrect = res?.isCorrect || false;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-4 text-xs transition ${
                      isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-red-50/50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-slate-500">
                        Кейс #{q.id} • {q.categoryLabel}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {isCorrect ? 'Выполнено безупречно' : 'Допущена ошибка'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1">{q.title}</h4>
                    <p className="text-slate-600 mb-2">{q.situation}</p>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-[11px] leading-relaxed shadow-sm">
                      <strong className="text-amber-800">Разбор регламента Onliner: </strong>
                      {q.expl}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Retake / Home Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onGoHome}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 transition"
          >
            На главный экран
          </button>

          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#ffd300] hover:bg-[#f0c600] text-black font-black text-xs sm:text-sm border border-amber-400 shadow-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Пройти экзамен повторно</span>
          </button>
        </div>
      </div>
    </div>
  );
};
