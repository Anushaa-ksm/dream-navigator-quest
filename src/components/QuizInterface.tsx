import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Import question images
import question1Image from '@/assets/question-1.jpg';
import question2Image from '@/assets/question-2.jpg';
import question3Image from '@/assets/question-3.jpg';
import question4Image from '@/assets/question-4.jpg';
import question5Image from '@/assets/question-5.jpg';

interface Question {
  id: number;
  question: string;
  image: string;
  options: Option[];
  category: 'skills' | 'interests' | 'strengths';
}

interface Option {
  text: string;
  value: string;
  careerPaths: string[];
  points: number;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What type of problems do you enjoy solving the most?",
    category: 'interests',
    image: question1Image,
    options: [
      { text: "Coding and technical challenges", value: "technical", careerPaths: ["tech", "science"], points: 10 },
      { text: "Helping people with their health", value: "health", careerPaths: ["healthcare"], points: 10 },
      { text: "Creating beautiful designs", value: "creative", careerPaths: ["arts"], points: 10 },
      { text: "Business strategy and planning", value: "business", careerPaths: ["business"], points: 10 },
    ]
  },
  {
    id: 2,
    question: "Which activity energizes you the most?",
    category: 'strengths',
    image: question2Image,
    options: [
      { text: "Building apps and websites", value: "building", careerPaths: ["tech"], points: 8 },
      { text: "Researching medical breakthroughs", value: "research", careerPaths: ["healthcare", "science"], points: 8 },
      { text: "Designing visual experiences", value: "designing", careerPaths: ["arts"], points: 8 },
      { text: "Leading team projects", value: "leading", careerPaths: ["business"], points: 8 },
    ]
  },
  {
    id: 3,
    question: "What's your preferred work environment?",
    category: 'skills',
    image: question3Image,
    options: [
      { text: "Tech startup with cutting-edge tools", value: "startup", careerPaths: ["tech"], points: 9 },
      { text: "Hospital or research lab", value: "medical", careerPaths: ["healthcare", "science"], points: 9 },
      { text: "Creative studio with artistic freedom", value: "studio", careerPaths: ["arts"], points: 9 },
      { text: "Corporate office with growth opportunities", value: "corporate", careerPaths: ["business"], points: 9 },
    ]
  },
  {
    id: 4,
    question: "Which skill do you want to develop further?",
    category: 'skills',
    image: question4Image,
    options: [
      { text: "Programming and AI", value: "programming", careerPaths: ["tech"], points: 10 },
      { text: "Medical knowledge and patient care", value: "medical", careerPaths: ["healthcare"], points: 10 },
      { text: "Artistic techniques and creativity", value: "artistic", careerPaths: ["arts"], points: 10 },
      { text: "Leadership and business acumen", value: "business", careerPaths: ["business"], points: 10 },
    ]
  },
  {
    id: 5,
    question: "What motivates you most in your future career?",
    category: 'interests',
    image: question5Image,
    options: [
      { text: "Innovation and technological advancement", value: "innovation", careerPaths: ["tech", "science"], points: 10 },
      { text: "Saving lives and improving health", value: "health", careerPaths: ["healthcare"], points: 10 },
      { text: "Self-expression and inspiring others", value: "expression", careerPaths: ["arts"], points: 10 },
      { text: "Financial success and influence", value: "success", careerPaths: ["business"], points: 10 },
    ]
  }
];

interface QuizInterfaceProps {
  onAnswerSelect: (answer: Option, questionId: number) => void;
  onQuizComplete: (results: CareerResults) => void;
  currentQuestion: number;
}

interface CareerResults {
  topPaths: Array<{ path: string; score: number; percentage: number }>;
  totalScore: number;
  answeredQuestions: number;
}

export default function QuizInterface({ onAnswerSelect, onQuizComplete, currentQuestion }: QuizInterfaceProps) {
  const [answers, setAnswers] = useState<Record<number, Option>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const question = quizQuestions[currentQuestion - 1];
  const progress = ((currentQuestion - 1) / quizQuestions.length) * 100;

  const handleOptionClick = async (option: Option) => {
    if (isAnswering) return;
    
    setSelectedOption(option.value);
    setIsAnswering(true);

    // Update answers
    const newAnswers = { ...answers, [question.id]: option };
    setAnswers(newAnswers);

    // Update scores
    const newScores = { ...scores };
    option.careerPaths.forEach(path => {
      newScores[path] = (newScores[path] || 0) + option.points;
    });
    setScores(newScores);

    // Call parent callback
    onAnswerSelect(option, question.id);

    // Wait for animation, then proceed
    setTimeout(() => {
      setIsAnswering(false);
      setSelectedOption(null);

      // Check if quiz is complete
      if (currentQuestion >= quizQuestions.length) {
        const totalScore = Object.values(newScores).reduce((sum, score) => sum + score, 0);
        const sortedPaths = Object.entries(newScores)
          .map(([path, score]) => ({
            path,
            score,
            percentage: Math.round((score / totalScore) * 100)
          }))
          .sort((a, b) => b.score - a.score);

        const results: CareerResults = {
          topPaths: sortedPaths,
          totalScore,
          answeredQuestions: Object.keys(newAnswers).length
        };

        onQuizComplete(results);
      }
    }, 1500);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'skills': return 'tech';
      case 'interests': return 'healthcare';
      case 'strengths': return 'arts';
      default: return 'primary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'skills': return '⚡';
      case 'interests': return '❤️';
      case 'strengths': return '💪';
      default: return '📋';
    }
  };

  if (!question) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={`bg-${getCategoryColor(question.category)}/10`}>
            {getCategoryIcon(question.category)} {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {currentQuestion} of {quizQuestions.length}
          </span>
        </div>
        <Progress value={progress} className="h-3 mb-2" />
        <p className="text-xs text-muted-foreground text-center">
          {Math.round(progress)}% Complete
        </p>
      </div>

      {/* Question Card */}
      <Card className="quiz-card p-8 mb-6">
        {/* Question Image */}
        <div className="mb-6 rounded-lg overflow-hidden">
          <img 
            src={question.image} 
            alt={`Question ${currentQuestion} illustration`}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          {question.question}
        </h2>

        {/* Answer Options */}
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className={`
                w-full p-6 text-left h-auto justify-start text-wrap
                transition-all duration-300 hover:scale-[1.02]
                ${selectedOption === option.value 
                  ? 'bg-primary text-primary-foreground glow-effect' 
                  : 'hover:bg-primary/10'
                }
                ${isAnswering && selectedOption !== option.value ? 'opacity-50' : ''}
              `}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswering}
            >
              <div className="flex items-center w-full">
                <span className={`
                  flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4
                  ${selectedOption === option.value 
                    ? 'bg-primary-foreground text-primary border-primary-foreground' 
                    : 'border-muted-foreground'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-base">{option.text}</span>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Gamification Elements */}
      <div className="text-center">
        <div className="flex justify-center space-x-4 mb-4">
          {Object.entries(scores).map(([path, score]) => (
            <div key={path} className="text-center">
              <div className={`w-12 h-12 rounded-full bg-${path} flex items-center justify-center text-white font-bold mb-1`}>
                {score}
              </div>
              <p className="text-xs capitalize text-muted-foreground">{path}</p>
            </div>
          ))}
        </div>
        
        {isAnswering && (
          <p className="text-primary font-medium animate-pulse">
            Great choice! Moving forward on your journey... ✨
          </p>
        )}
      </div>
    </div>
  );
}