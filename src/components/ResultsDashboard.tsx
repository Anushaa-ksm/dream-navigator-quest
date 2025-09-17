import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface CareerResults {
  topPaths: Array<{ path: string; score: number; percentage: number }>;
  totalScore: number;
  answeredQuestions: number;
}

interface ResultsDashboardProps {
  results: CareerResults;
  onRestart: () => void;
}

const careerInfo = {
  tech: {
    title: 'Technology & Engineering',
    description: 'Build the future with code, AI, and innovative solutions.',
    icon: '💻',
    careers: ['Software Developer', 'AI Engineer', 'Data Scientist', 'Cybersecurity Analyst'],
    color: 'tech',
  },
  healthcare: {
    title: 'Healthcare & Medicine',
    description: 'Heal, care, and improve lives through medical science.',
    icon: '🏥',
    careers: ['Doctor', 'Nurse', 'Medical Researcher', 'Therapist'],
    color: 'healthcare',
  },
  arts: {
    title: 'Arts & Design',
    description: 'Create, inspire, and express through visual and performing arts.',
    icon: '🎨',
    careers: ['Graphic Designer', 'Artist', 'Animator', 'Creative Director'],
    color: 'arts',
  },
  business: {
    title: 'Business & Finance',
    description: 'Lead, strategize, and drive economic growth.',
    icon: '💼',
    careers: ['Business Analyst', 'Marketing Manager', 'Entrepreneur', 'Financial Advisor'],
    color: 'business',
  },
  science: {
    title: 'Science & Research',
    description: 'Discover, experiment, and advance human knowledge.',
    icon: '🔬',
    careers: ['Research Scientist', 'Environmental Scientist', 'Physicist', 'Biologist'],
    color: 'science',
  },
};

export default function ResultsDashboard({ results, onRestart }: ResultsDashboardProps) {
  const topPath = results.topPaths[0];
  const topCareerInfo = careerInfo[topPath.path as keyof typeof careerInfo];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Your Career Journey Results! 🎉
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Based on your responses, here's your personalized career guidance
        </p>
      </div>

      {/* Top Career Match */}
      <Card className={`quiz-card p-8 border-${topCareerInfo.color} glow-effect`}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{topCareerInfo.icon}</div>
          <h2 className="text-3xl font-bold mb-2">{topCareerInfo.title}</h2>
          <p className="text-lg text-muted-foreground mb-4">{topCareerInfo.description}</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {topPath.percentage}% Match
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Career Opportunities:</h3>
            <ul className="space-y-2">
              {topCareerInfo.careers.map((career, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  {career}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Why This Fits You:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Strong alignment with your interests</li>
              <li>✅ Matches your natural strengths</li>
              <li>✅ Utilizes your preferred skills</li>
              <li>✅ High growth potential</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* All Career Paths */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">All Career Path Scores</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.topPaths.map((pathResult, index) => {
            const info = careerInfo[pathResult.path as keyof typeof careerInfo];
            return (
              <Card key={pathResult.path} className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{info.icon}</div>
                  <h3 className="font-semibold">{info.title}</h3>
                </div>
                
                <div className="space-y-3">
                  <Progress value={pathResult.percentage} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Match Score</span>
                    <span className="font-semibold">{pathResult.percentage}%</span>
                  </div>
                  <Badge variant={index === 0 ? "default" : "outline"} className="w-full justify-center">
                    {index === 0 ? 'Best Match' : `${index + 1}${index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Choice`}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="px-8">
            Explore {topCareerInfo.title}
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            View Learning Path
          </Button>
          <Button size="lg" variant="outline" onClick={onRestart}>
            Retake Quiz
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-6">
          Remember: This is just the beginning of your journey. Explore, learn, and grow! 🌟
        </p>
      </div>
    </div>
  );
}