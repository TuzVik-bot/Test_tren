import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TrafficLightModal } from './components/TrafficLightModal';
import { DashboardView } from './components/DashboardView';
import { PracticeView } from './components/PracticeView';
import { ExamRegistration, EmployeeInfo } from './components/ExamRegistration';
import { ExamInteractiveView } from './components/ExamInteractiveView';
import { ExamResultView } from './components/ExamResultView';
import { AnimatedCartoon } from './components/AnimatedCartoon';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'practice' | 'exam'>('dashboard');
  const [isTrafficLightOpen, setIsTrafficLightOpen] = useState<boolean>(false);
  
  // Cartoon modal state (opens on first load as requested)
  const [isCartoonOpen, setIsCartoonOpen] = useState<boolean>(() => {
    // Open on initial startup
    return true;
  });

  // Exam sub-flow
  const [examStep, setExamStep] = useState<'registration' | 'testing' | 'results'>('registration');
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
  const [examScore, setExamScore] = useState<number>(0);
  const [examTotal, setExamTotal] = useState<number>(10);
  const [examQuestionResults, setExamQuestionResults] = useState<{ id: number; isCorrect: boolean; userAns: any }[]>([]);
  const [examTimeSpentSeconds, setExamTimeSpentSeconds] = useState<number>(0);

  const handleStartPractice = () => {
    setCurrentView('practice');
  };

  const handleStartExamFlow = () => {
    setCurrentView('exam');
    setExamStep('registration');
  };

  const handleEmployeeRegistered = (info: EmployeeInfo) => {
    setEmployeeInfo(info);
    setExamScore(0);
    setExamQuestionResults([]);
    setExamTimeSpentSeconds(0);
    setExamStep('testing');
  };

  const handleFinishInteractiveExam = (results: {
    answers: Record<number, any>;
    score: number;
    total: number;
    questionResults: { id: number; isCorrect: boolean; userAns: any }[];
    timeSpentSeconds: number;
  }) => {
    setExamScore(results.score);
    setExamTotal(results.total);
    setExamQuestionResults(results.questionResults);
    setExamTimeSpentSeconds(results.timeSpentSeconds);
    setExamStep('results');
  };

  const handleRetakeExam = () => {
    setExamScore(0);
    setExamQuestionResults([]);
    setExamTimeSpentSeconds(0);
    setExamStep('registration');
  };

  const handleQuitExam = () => {
    setExamStep('registration');
    setCurrentView('dashboard');
  };

  const isExamInProgress = currentView === 'exam' && examStep === 'testing';

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-900 flex flex-col font-sans selection:bg-[#ffd300] selection:text-black">
      {/* Animated Cartoon Modal (starts at beginning & can be reopened) */}
      {isCartoonOpen && (
        <AnimatedCartoon
          onFinish={() => setIsCartoonOpen(false)}
          onClose={() => setIsCartoonOpen(false)}
        />
      )}

      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'exam') {
            handleStartExamFlow();
          } else {
            setCurrentView(view);
          }
        }}
        onOpenTrafficLight={() => setIsTrafficLightOpen(true)}
        onOpenCartoon={() => setIsCartoonOpen(true)}
        examInProgress={isExamInProgress}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentView === 'dashboard' && (
          <DashboardView
            onStartPractice={handleStartPractice}
            onStartExam={handleStartExamFlow}
            onOpenTrafficLight={() => setIsTrafficLightOpen(true)}
            onOpenCartoon={() => setIsCartoonOpen(true)}
          />
        )}

        {currentView === 'practice' && (
          <PracticeView
            onOpenTrafficLight={() => setIsTrafficLightOpen(true)}
            onGoToExam={handleStartExamFlow}
          />
        )}

        {currentView === 'exam' && (
          <>
            {examStep === 'registration' && (
              <ExamRegistration
                onStartExam={handleEmployeeRegistered}
                onCancel={() => setCurrentView('dashboard')}
              />
            )}

            {examStep === 'testing' && employeeInfo && (
              <ExamInteractiveView
                employeeInfo={employeeInfo}
                onFinishExam={handleFinishInteractiveExam}
                onQuit={handleQuitExam}
              />
            )}

            {examStep === 'results' && employeeInfo && (
              <ExamResultView
                employeeInfo={employeeInfo}
                score={examScore}
                total={examTotal}
                questionResults={examQuestionResults}
                timeSpentSeconds={examTimeSpentSeconds}
                onRetake={handleRetakeExam}
                onGoHome={() => setCurrentView('dashboard')}
              />
            )}
          </>
        )}
      </main>

      {/* Traffic Light Rules Modal */}
      <TrafficLightModal
        isOpen={isTrafficLightOpen}
        onClose={() => setIsTrafficLightOpen(false)}
      />

      {/* Global Onliner Footer (Hidden in Print) */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-black text-[#ffd300] font-black text-xs px-1.5 py-0.2 rounded">
              onlíner
            </span>
            <span>
              © 2026 ООО «ОНЛАЙНЕР» (УНП 190635942, Минск, пр-т Дзержинского, 5, оф. 303). Все права защищены.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span>Каталог Onliner</span>
            <span>•</span>
            <span>Onliner Prime</span>
            <span>•</span>
            <span>Комплаенс ИБ и ВЭД</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
