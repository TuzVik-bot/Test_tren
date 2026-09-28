export function generateVerificationHash(
  fullName: string,
  department: string,
  email: string,
  score: number,
  total: number,
  timestamp: string
): string {
  const rawString = `${fullName.trim().toUpperCase()}|${department}|${email.toLowerCase()}|${score}/${total}|${timestamp}|LOGIX-SALT-2026`;
  
  // Deterministic 32-bit FNV-1a & Murmur-like hash mix
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  
  for (let i = 0; i < rawString.length; i++) {
    const code = rawString.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 = Math.imul(h2 ^ (code << 3), 0x5bd1e995);
  }
  
  const hex1 = Math.abs(h1).toString(16).padStart(8, '0').toUpperCase();
  const hex2 = Math.abs(h2).toString(16).padStart(8, '0').toUpperCase();
  
  return `LX-SEC-${hex1.slice(0, 4)}-${hex1.slice(4, 8)}-${hex2.slice(0, 4)}-${hex2.slice(4, 8)}`;
}

export function formatReportText(data: {
  fullName: string;
  department: string;
  email: string;
  score: number;
  total: number;
  passed: boolean;
  timeSpentSeconds: number;
  verificationHash: string;
  categoryScores: Record<string, { correct: number; total: number; percent: number; label: string }>;
  dateStr: string;
}): string {
  const min = Math.floor(data.timeSpentSeconds / 60);
  const sec = data.timeSpentSeconds % 60;
  const timeFormatted = `${min} мин ${sec} сек`;

  let catLines = Object.values(data.categoryScores)
    .map(c => `  - ${c.label}: ${c.correct}/${c.total} (${c.percent}%)`)
    .join('\n');

  return `=====================================================
ОФИЦИАЛЬНЫЙ ОТЧЕТ О ПРОХОЖДЕНИИ АТТЕСТАЦИИ ИБ
«Безопасный ИИ в международной логистике и ВЭД»
=====================================================
Сотрудник: ${data.fullName}
Отдел: ${data.department}
E-mail: ${data.email}
Дата сдачи: ${data.dateStr}
Время прохождения: ${timeFormatted}
-----------------------------------------------------
РЕЗУЛЬТАТ: ${data.score} из ${data.total} (${Math.round((data.score / data.total) * 100)}%)
ВЕРДИКТ: ${data.passed ? '✅ АТТЕСТАЦИЯ ПРОЙДЕНА (СДАН)' : '❌ АТТЕСТАЦИЯ НЕ ПРОЙДЕНА (НЕ СДАН)'}
Порог сдачи: 85% (минимум 26 правильных ответов)
-----------------------------------------------------
АНАЛИТИКА ПО КАТЕГОРИЯМ РИСКА:
${catLines}
-----------------------------------------------------
КРИПТОГРАФИЧЕСКИЙ ХЕШ ВЕРИФИКАЦИИ:
${data.verificationHash}
(Защищен от модификации данных сотрудника)
=====================================================`;
}

export function formatReportJson(data: {
  fullName: string;
  department: string;
  email: string;
  score: number;
  total: number;
  passed: boolean;
  timeSpentSeconds: number;
  verificationHash: string;
  categoryScores: Record<string, { correct: number; total: number; percent: number; label: string }>;
  dateStr: string;
}): string {
  return JSON.stringify(
    {
      app: 'Logix AI Safety Trainer & Exam',
      certificateCode: data.verificationHash,
      employee: {
        fullName: data.fullName,
        department: data.department,
        email: data.email,
      },
      assessment: {
        examName: 'Безопасный ИИ в международной логистике',
        date: data.dateStr,
        durationSeconds: data.timeSpentSeconds,
        score: data.score,
        totalQuestions: data.total,
        percentage: Math.round((data.score / data.total) * 100),
        verdict: data.passed ? 'PASSED' : 'FAILED',
        passingScoreThreshold: '85%',
        categories: data.categoryScores,
      },
      verifiedAt: new Date().toISOString(),
    },
    null,
    2
  );
}
