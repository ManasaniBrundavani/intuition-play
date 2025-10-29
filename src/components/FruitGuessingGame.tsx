import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Volume2, Trophy, RefreshCw, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

const fruits = [
  'apple', 'banana', 'orange', 'grape', 'mango', 
  'strawberry', 'watermelon', 'pineapple', 'cherry', 'peach',
  'kiwi', 'papaya', 'blueberry', 'coconut', 'lemon',
  'lime', 'avocado', 'pomegranate', 'guava', 'dragon fruit',
  'passion fruit', 'lychee', 'plum', 'apricot', 'fig',
  'melon', 'cantaloupe', 'honeydew', 'tangerine', 'grapefruit',
  'blackberry', 'raspberry', 'cranberry', 'gooseberry', 'mulberry',
  'persimmon', 'dates', 'jackfruit', 'durian', 'rambutan',
  'starfruit', 'mangosteen', 'longan', 'kumquat', 'nectarine',
  'pear', 'quince', 'elderberry', 'boysenberry', 'acai'
];

export default function FruitGuessingGame() {
  const [secretFruit, setSecretFruit] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [systemScore, setSystemScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(3);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [lastGuess, setLastGuess] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [hint, setHint] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    initializeGame();
    setupSpeechRecognition();
  }, []);

  const setupSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setLastGuess(transcript);
        checkGuess(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        speakText("Sorry, I couldn't hear you clearly. Please try again.");
        toast({
          title: "Microphone Error",
          description: "Please check your microphone and try again.",
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
        description: "Please use Chrome or Edge for speech recognition.",
        variant: "destructive",
      });
    }
  };

  const initializeGame = () => {
    const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
    setSecretFruit(randomFruit);
    setAttempts(0);
    setGameStatus('playing');
    setLastGuess('');
    
    // Generate hint
    const firstLetter = randomFruit.charAt(0).toUpperCase();
    const length = randomFruit.length;
    setHint(`${length} letters, starts with "${firstLetter}"`);
    
    setTimeout(() => {
      speakText(`I'm thinking of a fruit. Can you guess what it is? Here's a hint: ${length} letters, starting with ${firstLetter}. You have ${maxAttempts} attempts.`);
    }, 500);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognition && gameStatus === 'playing') {
      setIsListening(true);
      recognition.start();
      speakText("I'm listening...");
    }
  };

  const checkGuess = (guess: string) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Check if guess matches the secret fruit
    if (guess === secretFruit || guess.includes(secretFruit) || secretFruit.includes(guess)) {
      // User wins!
      setGameStatus('won');
      setUserScore(prev => prev + 1);
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });

      speakText(`Congratulations! You guessed it right! The fruit was ${secretFruit}. You win this round!`);
      
      toast({
        title: "🎉 You Win!",
        description: `The fruit was ${secretFruit}!`,
        className: "bg-gradient-success text-success-foreground",
      });
    } else if (newAttempts >= maxAttempts) {
      // System wins
      setGameStatus('lost');
      setSystemScore(prev => prev + 1);
      
      speakText(`Game over! You've used all your attempts. The fruit was ${secretFruit}. I win this round. Better luck next time!`);
      
      toast({
        title: "System Wins",
        description: `The fruit was ${secretFruit}. Try again!`,
        variant: "destructive",
      });
    } else {
      // Wrong guess, continue
      const remainingAttempts = maxAttempts - newAttempts;
      const feedback = generateFeedback(guess);
      
      speakText(`${feedback} You have ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} left. Try again!`);
      
      toast({
        title: "Not quite!",
        description: `${feedback} ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`,
      });
    }
  };

  const generateFeedback = (guess: string): string => {
    const feedbacks = [
      "That's not it.",
      "Nope, try again.",
      "Not the right fruit.",
      "Keep guessing!",
      "Wrong fruit, but you're trying!"
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const playAgain = () => {
    initializeGame();
  };

  const giveHint = () => {
    const hints = [
      `The fruit has ${secretFruit.length} letters.`,
      `It starts with the letter ${secretFruit.charAt(0).toUpperCase()}.`,
      `Think of fruits you commonly see.`,
    ];
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    speakText(randomHint);
    toast({
      title: "Hint",
      description: randomHint,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary shadow-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Fruit Guessing Game
          </h1>
          <p className="text-lg text-muted-foreground">
            I'm thinking of a fruit. Can you guess it?
          </p>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 text-center bg-gradient-to-br from-success/10 to-success/5">
            <div className="text-sm text-muted-foreground mb-2">Your Score</div>
            <div className="text-4xl font-bold text-success">{userScore}</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-destructive/10 to-destructive/5">
            <div className="text-sm text-muted-foreground mb-2">System Score</div>
            <div className="text-4xl font-bold text-destructive">{systemScore}</div>
          </Card>
        </div>

        {/* Main Game Card */}
        <Card className="p-8 space-y-6 shadow-glow bg-gradient-to-br from-card to-card/80">
          {gameStatus === 'playing' ? (
            <>
              <div className="text-center space-y-4">
                <div className="inline-block px-6 py-3 bg-primary/10 rounded-full">
                  <span className="text-lg font-medium text-primary">
                    Hint: {hint}
                  </span>
                </div>
                
                <div className="text-2xl font-bold text-foreground">
                  Attempts: {attempts} / {maxAttempts}
                </div>

                {lastGuess && (
                  <div className="text-lg text-muted-foreground">
                    Your last guess: <span className="font-semibold text-foreground">"{lastGuess}"</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                <Button
                  size="lg"
                  onClick={startListening}
                  disabled={isListening}
                  className={`rounded-full px-12 py-8 text-xl ${
                    isListening 
                      ? 'bg-destructive animate-pulse' 
                      : 'bg-gradient-primary hover:shadow-glow'
                  }`}
                >
                  <Mic className={`w-8 h-8 mr-3 ${isListening ? 'animate-bounce' : ''}`} />
                  {isListening ? 'Listening...' : 'Speak Your Guess'}
                </Button>

                <Button
                  variant="outline"
                  onClick={giveHint}
                  disabled={isListening}
                  className="rounded-full"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Get a Hint
                </Button>
              </div>

              {isListening && (
                <div className="flex justify-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-primary rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 50 + 30}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className={`text-6xl ${gameStatus === 'won' ? 'text-success' : 'text-destructive'}`}>
                {gameStatus === 'won' ? '🎉' : '😅'}
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">
                  {gameStatus === 'won' ? 'You Win! 🎉' : 'You Lost! 😢'}
                </h2>
                <p className="text-xl text-muted-foreground">
                  The fruit was: <span className="font-bold text-foreground">{secretFruit}</span>
                </p>
                {gameStatus === 'lost' && (
                  <p className="text-lg text-destructive font-semibold">
                    Game Over - No attempts left!
                  </p>
                )}
              </div>

              <Button
                size="lg"
                onClick={playAgain}
                className="rounded-full px-12 py-6 text-lg bg-gradient-primary hover:shadow-glow"
              >
                <RefreshCw className="w-6 h-6 mr-2" />
                Restart Game
              </Button>
            </div>
          )}
        </Card>

        {/* Available Fruits */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Available Fruits
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {fruits.map((fruit) => (
                <div
                  key={fruit}
                  className="px-3 py-2 bg-card rounded-lg text-center text-sm font-medium border border-border hover:border-primary hover:shadow-soft transition-all"
                >
                  {fruit}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-muted/50">
          <div className="space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              How to Play
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• The computer picks a fruit secretly from the list above</li>
              <li>• You have {maxAttempts} attempts to guess correctly</li>
              <li>• Click "Speak Your Guess" and say the fruit name</li>
              <li>• The system will respond with voice feedback</li>
              <li>• Guess correctly to win the round!</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
