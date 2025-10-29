import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Volume2, Trophy, Zap, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface Word {
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const wordList: Word[] = [
  { word: 'hello', category: 'Greetings', difficulty: 'easy' },
  { word: 'goodbye', category: 'Greetings', difficulty: 'easy' },
  { word: 'thank you', category: 'Greetings', difficulty: 'easy' },
  { word: 'computer', category: 'Technology', difficulty: 'medium' },
  { word: 'smartphone', category: 'Technology', difficulty: 'medium' },
  { word: 'artificial intelligence', category: 'Technology', difficulty: 'hard' },
  { word: 'congratulations', category: 'Expressions', difficulty: 'hard' },
  { word: 'wonderful', category: 'Adjectives', difficulty: 'medium' },
  { word: 'extraordinary', category: 'Adjectives', difficulty: 'hard' },
  { word: 'beautiful', category: 'Adjectives', difficulty: 'medium' },
];

interface GameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onBack: () => void;
}

export default function Game({ difficulty, onBack }: GameProps) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(10);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        checkAnswer(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Microphone Error",
          description: "Please check your microphone permissions and try again.",
          variant: "destructive",
        });
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome or Edge.",
        variant: "destructive",
      });
    }

    selectNewWord();
  }, []);

  const selectNewWord = () => {
    const filteredWords = wordList.filter(w => w.difficulty === difficulty);
    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setCurrentWord(randomWord);
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const checkAnswer = (transcript: string) => {
    if (!currentWord) return;

    const targetWord = currentWord.word.toLowerCase();
    const similarity = calculateSimilarity(transcript, targetWord);

    if (similarity > 0.8) {
      // Correct answer
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      const bonusPoints = streak > 0 ? streak * 5 : 0;
      
      setScore(prev => prev + points + bonusPoints);
      setStreak(prev => prev + 1);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast({
        title: "Perfect! 🎉",
        description: `+${points + bonusPoints} points${bonusPoints > 0 ? ` (${bonusPoints} streak bonus!)` : ''}`,
        className: "bg-gradient-success text-success-foreground",
      });

      if (round < totalRounds) {
        setRound(prev => prev + 1);
        setTimeout(selectNewWord, 1500);
      } else {
        // Game complete
        setTimeout(() => {
          toast({
            title: "Game Complete! 🏆",
            description: `Final Score: ${score + points + bonusPoints} | Best Streak: ${streak + 1}`,
            duration: 5000,
          });
        }, 1500);
      }
    } else {
      // Wrong answer
      setStreak(0);
      toast({
        title: "Not quite right",
        description: `You said: "${transcript}". Try again!`,
        variant: "destructive",
      });
    }
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const playAudio = () => {
    if (currentWord) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Stats */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg shadow-soft">
              <Trophy className="w-5 h-5 text-accent" />
              <span className="font-bold text-lg">{score}</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg shadow-soft">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">{streak}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Round {round} of {totalRounds}</span>
            <span>{Math.round((round / totalRounds) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${(round / totalRounds) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Game Card */}
        <Card className="p-8 space-y-6 shadow-glow bg-gradient-to-br from-card to-card/80">
          <div className="text-center space-y-2">
            <div className="inline-block px-4 py-1 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">{currentWord.category}</span>
            </div>
            <h2 className="text-5xl font-bold text-foreground tracking-tight">
              {currentWord.word}
            </h2>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={playAudio}
              className="rounded-full"
            >
              <Volume2 className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              onClick={startListening}
              disabled={isListening || round > totalRounds}
              className={`rounded-full px-8 ${
                isListening 
                  ? 'bg-destructive animate-pulse' 
                  : 'bg-gradient-primary hover:shadow-glow'
              }`}
            >
              <Mic className={`w-6 h-6 mr-2 ${isListening ? 'animate-bounce' : ''}`} />
              {isListening ? 'Listening...' : 'Speak Now'}
            </Button>
          </div>

          {isListening && (
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Tips */}
        <Card className="p-4 bg-muted/50">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">Tip:</strong> Speak clearly into your microphone. 
              Click the speaker icon to hear the word pronounced.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
