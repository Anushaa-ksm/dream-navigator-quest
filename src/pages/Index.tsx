import React, { useState } from 'react';
import GameWorld from '@/components/GameWorld';
import QuizInterface from '@/components/QuizInterface';
import ResultsDashboard from '@/components/ResultsDashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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
  const [quizResults, setQuizResults] = useState<CareerResults | null>(null);
  const [playerStats, setPlayerStats] = useState({ coins: 0, level: 1, powerUps: [] });
  const [pathScores, setPathScores] = useState<Record<string, number>>({});
  const [dominantPath, setDominantPath] = useState<string>('');
  const { toast } = useToast();

  const handleStartQuiz = () => {
    setGameState('quiz');
    setCurrentQuestion(1);
    setActivePaths([]);
    setPlayerStats({ coins: 0, level: 1, powerUps: [] });
    setPathScores({});
    setDominantPath('');
  };

  const handleAnswerSelect = (answer: Option, questionId: number) => {
    // Update path scores
    const newPathScores = { ...pathScores };
    answer.careerPaths.forEach(path => {
      newPathScores[path] = (newPathScores[path] || 0) + answer.points;
    });
    setPathScores(newPathScores);
    
    // Find dominant path
    const sortedPaths = Object.entries(newPathScores).sort(([,a], [,b]) => b - a);
    const newDominantPath = sortedPaths[0]?.[0] || '';
    setDominantPath(newDominantPath);
    
    // Activate paths based on answer
    const newActivePaths = Array.from(new Set([...activePaths, ...answer.careerPaths]));
    setActivePaths(newActivePaths);
    
    // Award points for answering
    setPlayerStats(prev => ({
      ...prev,
      coins: prev.coins + answer.points,
      level: Math.floor((prev.coins + answer.points) / 50) + 1
    }));
    
    toast({
      title: `Moving towards ${newDominantPath}! 🎯`,
      description: `+${answer.points} points earned!`,
    });
    
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
    setQuizResults(null);
    setPlayerStats({ coins: 0, level: 1, powerUps: [] });
    setPathScores({});
    setDominantPath('');
  };

  const handleCoinCollect = () => {
    setPlayerStats(prev => ({
      ...prev,
      coins: prev.coins + 10
    }));
    
    toast({
      title: "Coin Collected! 🪙",
      description: "+10 coins",
    });
  };

  const handlePowerUpCollect = (type: string) => {
    setPlayerStats(prev => ({
      ...prev,
      powerUps: [...prev.powerUps, type] as string[]
    }));
    
    toast({
      title: "Power-up Collected! ⚡",
      description: `${type} boost activated!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 relative overflow-hidden">
      {/* 3D Game World Background */}
      <div className="fixed inset-0 z-0">
        <GameWorld
          currentQuestion={currentQuestion}
          totalQuestions={5}
          activePaths={activePaths}
          dominantPath={dominantPath}
          pathScores={pathScores}
          onCoinCollect={handleCoinCollect}
          onPowerUpCollect={handlePowerUpCollect}
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
                 <p>🚀 Navigate through pixel art career islands</p>
                 <p>🪙 Collect coins and power-ups along your journey</p>
                 <p>✨ Get personalized career recommendations</p>
                 <p>🎮 Fully gamified 3D experience with achievements</p>
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

      {/* Game Stats UI */}
      <div className="fixed top-4 left-4 z-20 space-y-2">
        <Button variant="outline" onClick={handleRestart}>
          🏠 Home
        </Button>
        {gameState !== 'welcome' && (
          <Card className="quiz-card p-4 min-w-[200px]">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="font-bold text-primary">{playerStats.level}</span>
              </div>
              <div className="flex justify-between">
                <span>Coins:</span>
                <span className="font-bold text-warning">🪙 {playerStats.coins}</span>
              </div>
              <div className="flex justify-between">
                <span>Power-ups:</span>
                <span className="font-bold">{playerStats.powerUps.length}</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
