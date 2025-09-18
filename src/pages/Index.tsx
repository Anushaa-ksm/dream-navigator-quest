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
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0f0f23 0%, #1e1b4b 50%, #312e81 100%)' }}>
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

      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 z-5 pointer-events-none">
        {/* Top border gems */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-8">
          <div className="w-6 h-6 bg-red-500 rotate-45 animate-pulse"></div>
          <div className="w-6 h-6 bg-blue-500 rotate-45 animate-pulse delay-300"></div>
          <div className="w-6 h-6 bg-green-500 rotate-45 animate-pulse delay-700"></div>
        </div>
        
        {/* Side decorative elements */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 space-y-8">
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce delay-300"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce delay-700"></div>
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-8">
          <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce delay-500"></div>
          <div className="w-4 h-4 bg-teal-500 rounded-full animate-bounce delay-900"></div>
        </div>
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {gameState === 'welcome' && (
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Title Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-6xl font-bold mb-6" style={{ 
                  background: 'linear-gradient(45deg, #8b5cf6, #3b82f6, #06b6d4)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(139, 92, 246, 0.3)'
                }}>
                  CHOOSE YOUR COURSE
                </h1>
                
                {/* Career Path Icons Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-8">
                  <div className="flex flex-col items-center p-4 bg-gradient-to-b from-purple-600/20 to-transparent rounded-lg border border-purple-400/30 hover:border-purple-400/60 transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-2xl">💻</span>
                    </div>
                    <span className="text-sm font-bold text-white">TECHNOLOGY</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-gradient-to-b from-green-600/20 to-transparent rounded-lg border border-green-400/30 hover:border-green-400/60 transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-2xl">🏥</span>
                    </div>
                    <span className="text-sm font-bold text-white">HEALTHCARE</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-gradient-to-b from-pink-600/20 to-transparent rounded-lg border border-pink-400/30 hover:border-pink-400/60 transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <span className="text-sm font-bold text-white">ARTS</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-gradient-to-b from-orange-600/20 to-transparent rounded-lg border border-orange-400/30 hover:border-orange-400/60 transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-2xl">💼</span>
                    </div>
                    <span className="text-sm font-bold text-white">BUSINESS</span>
                  </div>
                </div>
                
                <p className="text-lg text-gray-300 mb-8">
                  Navigate through your career journey in an immersive 3D world
                </p>
                
                <Button 
                  size="lg"
                  className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-2 border-purple-400/50 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  onClick={handleStartQuiz}
                  style={{
                    textShadow: '0 0 10px rgba(255,255,255,0.5)',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                >
                  START JOURNEY 🚀
                </Button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'quiz' && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-6 shadow-2xl">
                <QuizInterface
                  onAnswerSelect={handleAnswerSelect}
                  onQuizComplete={handleQuizComplete}
                  currentQuestion={currentQuestion}
                />
              </div>
            </div>
          </div>
        )}

        {gameState === 'results' && quizResults && (
          <div className="w-full max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-6 shadow-2xl">
                <ResultsDashboard
                  results={quizResults}
                  onRestart={handleRestart}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Stats UI - Pixel Art Style */}
      <div className="fixed top-4 left-4 z-20 space-y-2">
        <Button 
          className="bg-slate-900/80 border-2 border-purple-400/50 text-white hover:border-purple-400/80 font-bold px-4 py-2"
          onClick={handleRestart}
        >
          🏠 HOME
        </Button>
        {gameState !== 'welcome' && (
          <div className="bg-slate-900/90 backdrop-blur-sm border-2 border-purple-500/50 rounded-lg p-4 min-w-[200px] shadow-xl">
            <div className="space-y-3 text-sm font-bold">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">LEVEL:</span>
                <span className="text-purple-400 text-lg">{playerStats.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">COINS:</span>
                <span className="text-yellow-400 text-lg">🪙 {playerStats.coins}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">POWER-UPS:</span>
                <span className="text-green-400 text-lg">⚡ {playerStats.powerUps.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
