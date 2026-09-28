import React, { useState } from 'react';
import { Award, User, Building2, Mail, CheckSquare, Square, AlertCircle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export interface EmployeeInfo {
  fullName: string;
  department: string;
  email: string;
  employeeId?: string;
}

interface ExamRegistrationProps {
  onStartExam: (info: EmployeeInfo) => void;
  onCancel: () => void;
}

const ONLINER_DEPARTMENTS = [
  'Onliner Доставка и складской комплекс (Шабаны)',
  'Таможенное декларирование и ВЭД (ТЛЦ Колядичи)',
  'Каталог Onliner (Работа с поставщиками)',
  'Onliner Prime (B2B Фрахт и магистрали)',
  'Финансы, валютный контроль и бухгалтерия',
  'Служба информационной безопасности и IT',
];

export const ExamRegistration: React.FC<ExamRegistrationProps> = ({ onStartExam, onCancel }) => {
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState(ONLINER_DEPARTMENTS[0]);
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Пожалуйста, укажите ваши Фамилию и Имя.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Укажите корректный корпоративный e-mail.');
      return;
    }
    if (!agreed) {
      setError('Необходимо подтвердить ознакомление с регламентом экзамена Onliner.');
      return;
    }

    setError(null);
    onStartExam({
      fullName: fullName.trim(),
      department,
      email: email.trim(),
      employeeId: employeeId.trim() || undefined,
    });
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-300/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-[#ffd300] flex items-center justify-center text-black font-black text-lg shrink-0 shadow-sm border border-amber-400">
            on
          </div>
          <div>
            <div className="inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider mb-1">
              ООО «ОНЛАЙНЕР» • АТТЕСТАЦИЯ 2026
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Регистрация сотрудника на экзамен
            </h1>
          </div>
        </div>

        {/* Rules Notice Box */}
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 mb-6 text-xs text-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Параметры интерактивного экзамена Onliner:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Количество: <strong>10 интерактивных кейсов</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Порог сдачи: <strong>≥ 80% (от 8 из 10)</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Формат: <strong>маскирование, сортировка, аудит</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>Верификация: <strong>хеш-код руководителя</strong></span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Фамилия и Имя сотрудника <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              placeholder="Например: Кузнецов Максим Владимирович"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Подразделение Onliner <span className="text-red-500">*</span></span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition"
            >
              {ONLINER_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Корпоративный E-mail Onliner <span className="text-red-500">*</span></span>
              </label>
              <input
                type="email"
                required
                placeholder="kuznetsov@onliner.by"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Табельный номер / ID</span>
              </label>
              <input
                type="text"
                placeholder="ONL-4091"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition font-mono"
              />
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div
            onClick={() => setAgreed(!agreed)}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-amber-400 transition"
          >
            <div className="mt-0.5 text-amber-600 shrink-0">
              {agreed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-400" />}
            </div>
            <div className="text-xs text-slate-700 leading-relaxed select-none">
              Я подтверждаю, что сдаю экзамен самостоятельно. Я ознакомлен с регламентом ООО «ОНЛАЙНЕР» по информационной безопасности и осознаю, что результаты экзамена формируют персональный отчет для руководства компании.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#ffd300] hover:bg-[#f0c600] text-black font-black text-sm border border-amber-400 shadow-md transition transform hover:-translate-y-0.5"
            >
              <span>Приступить к интерактивному экзамену</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
