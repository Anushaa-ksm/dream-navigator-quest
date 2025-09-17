import React, { useState } from 'react';
import CareerScene3D from '@/components/CareerScene3D';
import QuizInterface from '@/components/QuizInterface';
import ResultsDashboard from '@/components/ResultsDashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Option {
  text: string;
  value: string;
  careerPaths: string[];
  points: number;
}

interface CareerResults {
  topPaths: Array<{ path: string; score: number; percentage: number }>;
  totalScore: number;
  answeredQuestions: number;
}

const Index = () => {
  const [gameState, setGameState] = useState<'welcome' | 'quiz' | 'results'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [activePaths, setActivePaths] = useState<string[]>([]);
  const [studentPosition, setStudentPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [quizResults, setQuizResults] = useState<CareerResults | null>(null);

  const handleStartQuiz = () => {
    setGameState('quiz');
    setCurrentQuestion(1);
    setActivePaths([]);
    setStudentPosition([0, 0, 0]);
  };

  const handleAnswerSelect = (answer: Option, questionId: number) => {
    // Activate paths based on answer
    const newActivePaths = Array.from(new Set([...activePaths, ...answer.careerPaths]));
    setActivePaths(newActivePaths);
    
    // Move student forward (simulate progress toward dominant career path)
    const dominantPath = newActivePaths[0]; // Simplified - would be more complex in real implementation
    const pathPositions = {
      'tech': [1, 0, 0],
      'healthcare': [0.5, 0, 0.8],
      'arts': [-0.5, 0, 0.8],
      'business': [-1, 0, 0],
      'science': [0, 0, 1],
    };
    
    if (dominantPath && pathPositions[dominantPath as keyof typeof pathPositions]) {
      setStudentPosition(pathPositions[dominantPath as keyof typeof pathPositions] as [number, number, number]);
    }
    
    // Move to next question
    setTimeout(() => {
      setCurrentQuestion(prev => prev + 1);
    }, 1500);
  };

  const handleQuizComplete = (results: CareerResults) => {
    setQuizResults(results);
    setGameState('results');
  };

  const handleRestart = () => {
    setGameState('welcome');
    setCurrentQuestion(1);
    setActivePaths([]);
    setStudentPosition([0, 0, 0]);
    setQuizResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 relative overflow-hidden">
      {/* 3D Scene Background */}
      <div className="fixed inset-0 z-0">
        <CareerScene3D
          currentQuestion={currentQuestion}
          totalQuestions={5}
          activePaths={activePaths}
          studentPosition={studentPosition}
        />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {gameState === 'welcome' && (
          <Card className="quiz-card max-w-2xl mx-auto p-8 text-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-gradient">
                Career Compass 🧭
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover your ideal career path through an interactive 3D journey
              </p>
              <div className="text-lg space-y-4">
                <p>🎯 Analyze your skills and interests</p>
                <p>🚀 Navigate through different career islands</p>
                <p>✨ Get personalized career recommendations</p>
                <p>🎮 Gamified experience with visual progress</p>
              </div>
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg glow-effect"
                onClick={handleStartQuiz}
              >
                Start Your Journey 🚀
              </Button>
            </div>
          </Card>
        )}

        {gameState === 'quiz' && (
          <div className="w-full max-w-4xl mx-auto">
            <QuizInterface
              onAnswerSelect={handleAnswerSelect}
              onQuizComplete={handleQuizComplete}
              currentQuestion={currentQuestion}
            />
          </div>
        )}

        {gameState === 'results' && quizResults && (
          <div className="w-full">
            <ResultsDashboard
              results={quizResults}
              onRestart={handleRestart}
            />
          </div>
        )}
      </div>

      {/* Floating Elements */}
      <div className="fixed top-4 left-4 z-20">
        <Button variant="outline" onClick={handleRestart}>
          🏠 Home
        </Button>
      </div>
    </div>
  );
};

export default Index;
