import React from 'react';
import { Target, Award, ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight, BookOpen, Film, Sparkles, Building2, MapPin } from 'lucide-react';

interface DashboardViewProps {
  onStartPractice: () => void;
  onStartExam: () => void;
  onOpenTrafficLight: () => void;
  onOpenCartoon: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartPractice,
  onStartExam,
  onOpenTrafficLight,
  onOpenCartoon,
}) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Onliner Corporate Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          {/* Onliner Requisites Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffd300]/20 border border-amber-400 text-slate-900 text-xs font-bold mb-4 tracking-wide">
            <span className="bg-black text-[#ffd300] font-black px-1.5 py-0.5 rounded text-[10px]">
              onlíner
            </span>
            <span>ООО «ОНЛАЙНЕР» • УНП 190635942 • Минск</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Безопасный ИИ в <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700">логистике и ВЭД</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Интерактивный тренажер Onliner.by и официальная аттестация сотрудников отделов логистики, доставки, Каталога, таможенного оформления и международных расчетов. 
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap gap-3.5 items-center">
            <button
              onClick={onOpenCartoon}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-sm border border-amber-300 transition shadow-sm transform hover:-translate-y-0.5"
            >
              <Film className="w-4 h-4 text-amber-700" />
              <span>🎬 Посмотреть мультфильм</span>
            </button>

            <button
              onClick={onStartPractice}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5"
            >
              <Target className="w-4 h-4 text-[#ffd300]" />
              <span>Тренажер кейсов</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onStartExam}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ffd300] hover:bg-[#f0c600] text-black font-black text-sm border border-amber-400 shadow-md transition transform hover:-translate-y-0.5"
            >
              <Award className="w-4 h-4" />
              <span>Официальный экзамен (10 интерактивов)</span>
            </button>
          </div>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 pt-6 border-t border-slate-100 text-center sm:text-left">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="text-2xl font-black text-slate-900 font-mono">10</div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">Интерактивных испытаний</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="text-2xl font-black text-emerald-600 font-mono">≥ 80%</div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">Порог сдачи (от 8 из 10)</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="text-2xl font-black text-amber-600 font-mono">100%</div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">Защита от угадывания</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="text-2xl font-black text-blue-600 font-mono">SHA-256</div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">Верификация руководителя</div>
          </div>
        </div>
      </div>

      {/* Traffic Light Quick Reference */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <h2 className="text-xl font-bold text-slate-900 ml-1">
                Регламент Onliner: «Светофор безопасности»
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Базовые правила работы сотрудников с нейросетями в операционной логистике
            </p>
          </div>
          <button
            onClick={onOpenTrafficLight}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 transition"
          >
            <BookOpen className="w-4 h-4 text-slate-700" />
            <span>Открыть полный справочник с примерами</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Red Zone Card */}
          <div
            onClick={onOpenTrafficLight}
            className="cursor-pointer rounded-2xl bg-red-50/60 border border-red-200 p-5 hover:border-red-400 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-red-700 uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  🔴 Красная зона
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                  ЗАПРЕЩЕНО
                </span>
              </div>
              <p className="text-xs text-red-900/80 mb-3 font-semibold">
                Увольнение, материальная и уголовная ответственность:
              </p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>• <strong>Ставки и наценки:</strong> закрытые тарифы Maersk, MSC, маржа Onliner.</li>
                <li>• <strong>Персональные данные:</strong> паспорта водителей, коносаменты (152-ФЗ / 99-З).</li>
                <li>• <strong>Санкции:</strong> проверка судов по OFAC исключительно через ИИ.</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-red-200 text-xs font-bold text-red-700 flex items-center gap-1">
              <span>Смотреть все 5 правил красной зоны</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Yellow Zone Card */}
          <div
            onClick={onOpenTrafficLight}
            className="cursor-pointer rounded-2xl bg-amber-50/60 border border-amber-200 p-5 hover:border-amber-400 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-amber-800 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  🟡 Желтая зона
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  ОБЕЗЛИЧИВАНИЕ
                </span>
              </div>
              <p className="text-xs text-amber-900/80 mb-3 font-semibold">
                Разрешено ТОЛЬКО с обязательной десенсибилизацией:
              </p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>• <strong>Переписка с агентами:</strong> замена имен на [Компания А], сумм на [XXX].</li>
                <li>• <strong>Претензии (демередж):</strong> анализ договоров без номеров контейнеров.</li>
                <li>• <strong>Анализ отчетов:</strong> открытые индексы SCFI, Drewry без внутренних файлов.</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 text-xs font-bold text-amber-800 flex items-center gap-1">
              <span>Смотреть правила желтой зоны</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Green Zone Card */}
          <div
            onClick={onOpenTrafficLight}
            className="cursor-pointer rounded-2xl bg-emerald-50/60 border border-emerald-200 p-5 hover:border-emerald-400 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  🟢 Зеленая зона
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  СВОБОДНО
                </span>
              </div>
              <p className="text-xs text-emerald-900/80 mb-3 font-semibold">
                Свободное продуктивное использование ИИ:
              </p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>• <strong>Формулы Excel/Sheets:</strong> ВПР, XLOOKUP, регулярные выражения.</li>
                <li>• <strong>Мозговой штурм:</strong> варианты интермодальных цепочек в общем виде.</li>
                <li>• <strong>Нормативные акты:</strong> Инкотермс 2020, конвенция CMR, Гаага-Висби.</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1">
              <span>Смотреть разрешенные задачи</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Pathways: Practice vs Interactive Exam */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practice Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-7 sm:p-8 flex flex-col justify-between hover:border-amber-400 transition shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-5">
              <Target className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              Персонализированные кейсы
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              🎯 Тренажер реальных инцидентов
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Реальные ситуации сотрудников Onliner: декларанта Михаила Резникова на ТЛЦ «Колядичи», ведущего логиста Анастасии Ковалёвой, диспетчера автоколонны Виктора Данилова и юристов.
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={onStartPractice}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm transition shadow flex items-center justify-center gap-2"
            >
              <span>Тренироваться на кейсах</span>
              <ArrowRight className="w-4 h-4 text-[#ffd300]" />
            </button>
          </div>
        </div>

        {/* Exam Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-7 sm:p-8 flex flex-col justify-between hover:border-amber-400 transition shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#ffd300] flex items-center justify-center text-black font-black mb-5">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Официальная сертификация
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              🎓 Экзамен Onliner (10 интерактивов)
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              10 практических заданий с защитой от случайного угадывания: интерактивное маскирование данных в инвойсе, сортировка по зонам, поиск косвенных инъекций и выявление дипфейков.
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={onStartExam}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#ffd300] hover:bg-[#f0c600] text-black font-black text-sm border border-amber-400 transition shadow flex items-center justify-center gap-2"
            >
              <span>Сдать экзамен и получить сертификат</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
