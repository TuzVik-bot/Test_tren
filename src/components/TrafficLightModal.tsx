import React, { useState } from 'react';
import { X, Search, ShieldAlert, AlertTriangle, CheckCircle2, Copy, Check, FileText } from 'lucide-react';
import { trafficLightRules } from '../data/trafficLightRules';

interface TrafficLightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrafficLightModal: React.FC<TrafficLightModalProps> = ({ isOpen, onClose }) => {
  const [activeZone, setActiveZone] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filteredRules = trafficLightRules.filter((rule) => {
    const matchesZone = activeZone === 'all' || rule.zone === activeZone;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesZone;

    const matchesQuery =
      rule.title.toLowerCase().includes(query) ||
      (rule.consequences && rule.consequences.toLowerCase().includes(query)) ||
      (rule.legislation && rule.legislation.toLowerCase().includes(query)) ||
      rule.details.some((d) => d.toLowerCase().includes(query)) ||
      rule.examples.some((e) => e.toLowerCase().includes(query));

    return matchesZone && matchesQuery;
  });

  const handleCopySummary = () => {
    const summaryText = trafficLightRules
      .map(
        (r) =>
          `[${r.zone.toUpperCase()} ЗОНА ONLINER] ${r.title}\n${r.consequences ? `Последствия: ${r.consequences}\n` : ''}${r.details.map((d) => `• ${d}`).join('\n')}\nПримеры:\n${r.examples.map((e) => `  ${e}`).join('\n')}\n`
      )
      .join('\n---\n\n');

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-black text-[#ffd300] font-black text-xs px-1.5 py-0.2 rounded">onlíner</span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Регламент: «Светофор безопасности ИИ в логистике»
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Корпоративный стандарт ООО «ОНЛАЙНЕР» по обращению с конфиденциальными данными
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="p-2 text-slate-500 hover:text-black rounded-xl hover:bg-slate-100 transition"
              title="Скопировать справочник"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-black rounded-xl hover:bg-slate-100 transition"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls: Search and Zone Tabs */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 text-xs font-semibold shadow-sm">
            <button
              onClick={() => setActiveZone('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeZone === 'all' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:text-black'
              }`}
            >
              Все зоны (11)
            </button>
            <button
              onClick={() => setActiveZone('red')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition ${
                activeZone === 'red' ? 'bg-red-500 text-white shadow' : 'text-red-700 hover:bg-red-50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              🔴 Красная (5)
            </button>
            <button
              onClick={() => setActiveZone('yellow')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition ${
                activeZone === 'yellow' ? 'bg-amber-400 text-black shadow' : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              🟡 Желтая (3)
            </button>
            <button
              onClick={() => setActiveZone('green')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition ${
                activeZone === 'green' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              🟢 Зеленая (3)
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по правилам (ТН ВЭД, ставки...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition shadow-sm"
            />
          </div>
        </div>

        {/* Rules List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredRules.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>По вашему запросу правил не найдено</p>
            </div>
          ) : (
            filteredRules.map((rule) => {
              const isRed = rule.zone === 'red';
              const isYellow = rule.zone === 'yellow';
              const isGreen = rule.zone === 'green';

              return (
                <div
                  key={rule.id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
                    isRed
                      ? 'bg-red-50/70 border-red-200 hover:border-red-300'
                      : isYellow
                      ? 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
                      : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">
                        {isRed ? '🔴' : isYellow ? '🟡' : '🟢'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                        {rule.title}
                      </h3>
                    </div>

                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md self-start sm:self-auto ${
                        isRed
                          ? 'bg-red-600 text-white'
                          : isYellow
                          ? 'bg-amber-400 text-black'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isRed
                        ? 'СТРОГО ЗАПРЕЩЕНО'
                        : isYellow
                        ? 'ТОЛЬКО С ОБЕЗЛИЧИВАНИЕМ'
                        : 'СВОБОДНОЕ ИСПОЛЬЗОВАНИЕ'}
                    </span>
                  </div>

                  {rule.consequences && (
                    <div className="mb-3 text-xs font-semibold text-red-900 bg-red-100/80 p-2.5 rounded-xl border border-red-200 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span><strong>Последствия нарушения:</strong> {rule.consequences}</span>
                    </div>
                  )}

                  {rule.requirement && (
                    <div className="mb-3 text-xs font-semibold text-amber-900 bg-amber-100/80 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span><strong>Обязательное условие:</strong> {rule.requirement}</span>
                    </div>
                  )}

                  {/* Bullet Points */}
                  <ul className="space-y-1.5 mb-3.5 text-xs sm:text-sm text-slate-700">
                    {rule.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-slate-400 mt-1 font-bold">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Examples */}
                  {rule.examples.length > 0 && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono shadow-inner">
                      <div className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Примеры из логистики Onliner:
                      </div>
                      {rule.examples.map((ex, idx) => (
                        <div key={idx} className="text-slate-800 leading-relaxed font-sans text-xs">
                          {ex}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Legislation */}
                  {rule.legislation && (
                    <div className="mt-2.5 text-[11px] text-slate-500 italic">
                      Нормативная база: {rule.legislation}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Служба безопасности ООО «ОНЛАЙНЕР»</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
