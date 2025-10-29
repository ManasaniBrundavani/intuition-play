import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Trophy, Zap, Star, Volume2 } from 'lucide-react';

interface WelcomeScreenProps {
  onStartGame: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export default function WelcomeScreen({ onStartGame }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary shadow-glow animate-bounce-gentle">
            <Mic className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Speech Master
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your pronunciation skills! Speak the words you see and watch your streak grow.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 space-y-3 hover:shadow-soft transition-all">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg">Real-time Recognition</h3>
            <p className="text-sm text-muted-foreground">
              Advanced speech recognition powered by your browser
            </p>
          </Card>

          <Card className="p-6 space-y-3 hover:shadow-soft transition-all">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-lg">Track Your Score</h3>
            <p className="text-sm text-muted-foreground">
              Earn points and bonuses for maintaining streaks
            </p>
          </Card>

          <Card className="p-6 space-y-3 hover:shadow-soft transition-all">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-bold text-lg">Multiple Levels</h3>
            <p className="text-sm text-muted-foreground">
              Choose from easy, medium, or hard difficulty
            </p>
          </Card>
        </div>

        {/* Difficulty Selection */}
        <Card className="p-8 space-y-6 shadow-glow bg-gradient-to-br from-card to-card/80">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Choose Your Challenge</h2>
            <p className="text-muted-foreground">Select a difficulty level to begin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onStartGame('easy')}
              className="group relative p-6 rounded-2xl border-2 border-border hover:border-success transition-all hover:shadow-soft bg-card overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">Easy</span>
                  <Star className="w-6 h-6 text-success" />
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Simple words to get started
                </p>
                <div className="text-xs text-muted-foreground text-left">+10 points per word</div>
              </div>
            </button>

            <button
              onClick={() => onStartGame('medium')}
              className="group relative p-6 rounded-2xl border-2 border-border hover:border-primary transition-all hover:shadow-soft bg-card overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">Medium</span>
                  <div className="flex gap-1">
                    <Star className="w-5 h-5 text-primary" />
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Moderate challenge
                </p>
                <div className="text-xs text-muted-foreground text-left">+20 points per word</div>
              </div>
            </button>

            <button
              onClick={() => onStartGame('hard')}
              className="group relative p-6 rounded-2xl border-2 border-border hover:border-accent transition-all hover:shadow-soft bg-card overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">Hard</span>
                  <div className="flex gap-1">
                    <Star className="w-4 h-4 text-accent" />
                    <Star className="w-4 h-4 text-accent" />
                    <Star className="w-4 h-4 text-accent" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Expert level words
                </p>
                <div className="text-xs text-muted-foreground text-left">+30 points per word</div>
              </div>
            </button>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-muted/50">
          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-bold">How to Play</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Allow microphone access when prompted</li>
                <li>• Read the word displayed on screen</li>
                <li>• Click "Speak Now" and say the word clearly</li>
                <li>• Build streaks for bonus points!</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
