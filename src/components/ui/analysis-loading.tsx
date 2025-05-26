"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Progress } from "./progress"
import { Button } from "./button"
import { Flame, Zap, Target, FileCheck, Brain, Search, TrendingUp, CheckCircle, Clock, RotateCcw, Trophy } from "lucide-react"

interface AnalysisLoadingProps {
  progress?: number
  currentStep?: string
}

const loadingSteps = [
  { 
    icon: <FileCheck className="h-8 w-8 text-blue-500" />, 
    text: "Parsing your resume...", 
    detail: "Understanding structure and content",
    duration: 15 
  },
  { 
    icon: <Search className="h-8 w-8 text-purple-500" />, 
    text: "Analyzing job requirements...", 
    detail: "Extracting keywords and skills",
    duration: 10 
  },
  { 
    icon: <Brain className="h-8 w-8 text-orange-500" />, 
    text: "AI is roasting your resume...", 
    detail: "Being brutally honest (but constructive!)",
    duration: 40 
  },
  { 
    icon: <Target className="h-8 w-8 text-green-500" />, 
    text: "Calculating compatibility score...", 
    detail: "Matching your skills to job requirements",
    duration: 15 
  },
  { 
    icon: <Zap className="h-8 w-8 text-yellow-500" />, 
    text: "Generating improvement suggestions...", 
    detail: "Creating actionable feedback",
    duration: 15 
  },
  { 
    icon: <TrendingUp className="h-8 w-8 text-indigo-500" />, 
    text: "Finalizing your roast report...", 
    detail: "Almost ready to transform your resume!",
    duration: 5 
  }
]

const encouragingMessages = [
  "📈 Great resumes take time to analyze thoroughly!",
  "🔍 We're being extra detailed for the best feedback",
  "🚀 Your improved resume will be worth the wait",
  "💪 Getting ready to boost your interview chances",
  "🎯 Precision analysis leads to better results",
  "✨ Quality feedback requires careful consideration",
  "🔥 The roast will be legendary (and helpful!)"
]

// Tic-tac-toe game logic
type Player = 'X' | 'O' | null
type Board = Player[]

// Multi-game system
type GameType = 'wordScramble' | 'memoryCards' | 'trivia' | 'snake'

// Word Scramble Game
const WordScrambleGame = () => {
  const words = [
    { word: 'RESUME', hint: 'A summary of your work and education history 📄' },
    { word: 'INTERVIEW', hint: 'A meeting to assess your suitability for a role 🎙️' },
    { word: 'SKILLS', hint: 'Abilities that make you qualified for a job 🛠️' },
    { word: 'CAREER', hint: 'Your long-term professional path 🧭' },
    { word: 'LINKEDIN', hint: 'Online platform for professional networking 🌐' },
    { word: 'PORTFOLIO', hint: 'A showcase of your best projects or work 💼' },
    { word: 'EXPERIENCE', hint: 'Your previous roles and responsibilities 🏢' },
    { word: 'ACHIEVEMENTS', hint: 'Notable accomplishments in your career 🏆' },
    { word: 'NETWORKING', hint: 'Connecting with others for opportunities 🤝' },
    { word: 'QUALIFICATIONS', hint: 'Degrees, certifications, and credentials 🎓' },
    { word: 'COVERLETTER', hint: 'A message sent with your resume explaining why you’re a fit ✉️' },
    { word: 'REFERENCES', hint: 'People who can vouch for your work 🔍' },
    { word: 'ONBOARDING', hint: 'The process of integrating into a new job 🚀' },
    { word: 'PROMOTION', hint: 'Advancement to a higher position 📈' },
  ];

  const [currentWord, setCurrentWord] = useState(words[0])
  const [scrambledWord, setScrambledWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)

  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('')
  }

  const newWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(randomWord)
    setScrambledWord(scrambleWord(randomWord.word))
    setUserInput('')
    setIsCorrect(null)
    setShowHint(false)
  }

  useEffect(() => {
    newWord()
  }, [])

  const checkAnswer = () => {
    if (userInput.toUpperCase() === currentWord.word) {
      setIsCorrect(true)
      setScore(prev => prev + 1)
      setTimeout(() => newWord(), 1500)
    } else {
      setIsCorrect(false)
      setTimeout(() => setIsCorrect(null), 1000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Word Scramble</h3>
        <p className="text-sm text-gray-600 mb-4">Unscramble the career-related word!</p>
        
        <div className="text-2xl font-bold text-orange-600 mb-4 tracking-wider">
          {scrambledWord}
        </div>
        
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          className="w-full p-2 border border-gray-300 rounded-lg text-center uppercase tracking-wider"
          placeholder="TYPE YOUR ANSWER"
          maxLength={currentWord.word.length}
        />
        
        <div className="flex gap-2 mt-3">
          <Button onClick={checkAnswer} size="sm" className="flex-1">
            Check Answer
          </Button>
          <Button onClick={() => setShowHint(!showHint)} variant="outline" size="sm">
            💡 Hint
          </Button>
        </div>
        
        {showHint && (
          <p className="text-sm text-blue-600 mt-2 italic">
            {currentWord.hint}
          </p>
        )}
        
        {isCorrect === true && (
          <p className="text-green-600 font-semibold mt-2">🎉 Correct!</p>
        )}
        {isCorrect === false && (
          <p className="text-red-600 font-semibold mt-2">❌ Try again!</p>
        )}
        
        <div className="mt-3 text-sm text-gray-600">
          Score: {score} | <Button variant="ghost" size="sm" onClick={newWord}>Skip</Button>
        </div>
      </div>
    </div>
  )
}

// Memory Cards Game
const MemoryCardsGame = () => {
  const cardPairs = [
    { id: 1, text: '📄', match: 'Resume' },
    { id: 2, text: '💼', match: 'Job' },
    { id: 3, text: '🎯', match: 'Skills' },
    { id: 4, text: '🤝', match: 'Network' },
    { id: 5, text: '📈', match: 'Growth' },
    { id: 6, text: '⭐', match: 'Achievement' }
  ]

  const [cards, setCards] = useState<Array<{id: number, text: string, isFlipped: boolean, isMatched: boolean}>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)

  useEffect(() => {
    const shuffledCards = [...cardPairs, ...cardPairs.map(card => ({...card, id: card.id + 10, text: card.match}))]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        id: index,
        isFlipped: false,
        isMatched: false
      }))
    setCards(shuffledCards)
  }, [])

  const flipCard = (id: number) => {
    if (flippedCards.length === 2) return
    
    setCards(prev => prev.map(card => 
      card.id === id ? {...card, isFlipped: true} : card
    ))
    
    const newFlipped = [...flippedCards, id]
    setFlippedCards(newFlipped)
    
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)
      
      setTimeout(() => {
        if (firstCard && secondCard && 
            ((cardPairs.find(p => p.text === firstCard.text)?.match === secondCard.text) ||
             (cardPairs.find(p => p.text === secondCard.text)?.match === firstCard.text))) {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? {...card, isMatched: true} 
              : card
          ))
          setMatches(prev => prev + 1)
        } else {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? {...card, isFlipped: false} 
              : card
          ))
        }
        setFlippedCards([])
      }, 1000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Memory Match</h3>
        <p className="text-sm text-gray-600 mb-4">Match career icons with words!</p>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => flipCard(card.id)}
              disabled={card.isFlipped || card.isMatched}
              className={`h-12 w-12 border-2 rounded-lg font-bold text-sm transition-all ${
                card.isMatched 
                  ? 'bg-green-100 border-green-300 text-green-700' 
                  : card.isFlipped 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {card.isFlipped || card.isMatched ? card.text : '?'}
            </button>
          ))}
        </div>
        
        <p className="text-sm text-gray-600">
          Matches: {matches}/6 🎯
        </p>
      </div>
    </div>
  )
}

// Career Trivia Game
const CareerTriviaGame = () => {
  const questions = [
    {
      question: "What percentage of resumes never reach human eyes?",
      options: ["50%", "75%", "90%", "25%"],
      correct: 1,
      explanation: "75% of resumes are filtered out by ATS systems!"
    },
    {
      question: "How long do recruiters typically spend reviewing a resume?",
      options: ["30 seconds", "6 seconds", "2 minutes", "10 seconds"],
      correct: 1,
      explanation: "Recruiters spend an average of just 6 seconds on initial resume review!"
    },
    {
      question: "What's the most important section of a resume?",
      options: ["Education", "Experience", "Skills", "Summary"],
      correct: 1,
      explanation: "Experience section is most crucial as it shows your actual accomplishments!"
    },
    {
      question: "Best resume format for ATS systems?",
      options: ["PDF", "Word Doc", "Plain Text", "HTML"],
      correct: 1,
      explanation: "Word documents are generally most ATS-friendly!"
    }
  ]

  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    if (answerIndex === questions[currentQ].correct) {
      setScore(prev => prev + 1)
    }
    
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      }
    }, 2000)
  }

  const resetQuiz = () => {
    setCurrentQ(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
  }

  const question = questions[currentQ]

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Career Trivia</h3>
        <p className="text-sm text-gray-600 mb-4">Test your job search knowledge!</p>
        
        <div className="text-sm text-gray-500 mb-3">
          Question {currentQ + 1} of {questions.length}
        </div>
        
        <h4 className="font-medium mb-4 text-gray-800">
          {question.question}
        </h4>
        
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`w-full p-2 text-sm border rounded-lg transition-all ${
                showResult
                  ? index === question.correct
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : index === selectedAnswer
                      ? 'bg-red-100 border-red-300 text-red-700'
                      : 'bg-gray-100 border-gray-300'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {showResult && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              {question.explanation}
            </p>
          </div>
        )}
        
        <div className="mt-3 text-sm text-gray-600">
          Score: {score}/{questions.length}
          {currentQ === questions.length - 1 && showResult && (
            <Button variant="ghost" size="sm" onClick={resetQuiz} className="ml-2">
              Play Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Simple Snake Game
const SnakeGame = () => {
  const [snake, setSnake] = useState([[5, 5]])
  const [food, setFood] = useState([7, 7])
  const [direction, setDirection] = useState([0, 1])
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const gridSize = 10

  useEffect(() => {
    if (!isPlaying || gameOver) return

    const gameInterval = setInterval(() => {
      setSnake(currentSnake => {
        const newSnake = [...currentSnake]
        const head = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]]
        
        // Check boundaries
        if (head[0] < 0 || head[0] >= gridSize || head[1] < 0 || head[1] >= gridSize) {
          setGameOver(true)
          return currentSnake
        }
        
        // Check self collision
        if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
          setGameOver(true)
          return currentSnake
        }
        
        newSnake.unshift(head)
        
        // Check food collision
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore(prev => prev + 1)
          setFood([
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
          ])
        } else {
          newSnake.pop()
        }
        
        return newSnake
      })
    }, 200)

    return () => clearInterval(gameInterval)
  }, [direction, food, isPlaying, gameOver])

  const startGame = () => {
    setSnake([[5, 5]])
    setFood([7, 7])
    setDirection([0, 1])
    setGameOver(false)
    setScore(0)
    setIsPlaying(true)
  }

  const changeDirection = (newDirection: number[]) => {
    if (isPlaying && !gameOver) {
      setDirection(newDirection)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Skill Snake</h3>
        <p className="text-sm text-gray-600 mb-4">Collect skill points! 🐍</p>
        
        <div className="grid grid-cols-10 gap-1 mb-4 mx-auto w-fit">
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const row = Math.floor(index / gridSize)
            const col = index % gridSize
            const isSnake = snake.some(segment => segment[0] === row && segment[1] === col)
            const isFood = food[0] === row && food[1] === col
            
            return (
              <div
                key={index}
                className={`w-4 h-4 border border-gray-200 ${
                  isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-gray-100'
                }`}
              />
            )
          })}
        </div>
        
        {!isPlaying && !gameOver && (
          <Button onClick={startGame} size="sm">
            Start Game
          </Button>
        )}
        
        {gameOver && (
          <div className="space-y-2">
            <p className="text-red-600 font-semibold">Game Over!</p>
            <Button onClick={startGame} size="sm">
              Play Again
            </Button>
          </div>
        )}
        
        {isPlaying && (
          <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
            <div></div>
            <Button size="sm" onClick={() => changeDirection([-1, 0])}>↑</Button>
            <div></div>
            <Button size="sm" onClick={() => changeDirection([0, -1])}>←</Button>
            <div></div>
            <Button size="sm" onClick={() => changeDirection([0, 1])}>→</Button>
            <div></div>
            <Button size="sm" onClick={() => changeDirection([1, 0])}>↓</Button>
            <div></div>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mt-3">
          Skills Collected: {score} 🎯
        </p>
      </div>
    </div>
  )
}

// Main Game Component
const MiniGameHub = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('wordScramble')
  const [gamesPlayed, setGamesPlayed] = useState(0)

  const games: GameType[] = ['wordScramble', 'memoryCards', 'trivia', 'snake']

  useEffect(() => {
    // Randomly select a game on mount
    const randomGame = games[Math.floor(Math.random() * games.length)]
    setCurrentGame(randomGame)
  }, [])

  const switchGame = () => {
    const availableGames = games.filter(game => game !== currentGame)
    const nextGame = availableGames[Math.floor(Math.random() * availableGames.length)]
    setCurrentGame(nextGame)
    setGamesPlayed(prev => prev + 1)
  }

  const renderGame = () => {
    switch (currentGame) {
      case 'wordScramble':
        return <WordScrambleGame />
      case 'memoryCards':
        return <MemoryCardsGame />
      case 'trivia':
        return <CareerTriviaGame />
      case 'snake':
        return <SnakeGame />
      default:
        return <WordScrambleGame />
    }
  }

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Mini Games</span>
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={switchGame}
            className="h-8 px-3"
          >
            🎲 Switch Game
          </Button>
        </CardTitle>
        <div className="text-xs text-gray-500">
          Games played: {gamesPlayed} | Current: {currentGame.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {renderGame()}
        
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Play while your resume gets roasted! 🔥
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalysisLoading({ progress = 0, currentStep }: AnalysisLoadingProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(encouragingMessages[0])
  const [showSparkles, setShowSparkles] = useState(false)

  // Auto-advance through steps based on time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        const next = (prev + 1) % loadingSteps.length
        return next
      })
    }, 3000) // Change step every 3 seconds

    return () => clearInterval(interval)
  }, [])

  // Animate progress bar
  useEffect(() => {
    const targetProgress = Math.min(progress || (currentStepIndex * 16.67), 100)
    const increment = (targetProgress - animatedProgress) / 20
    
    const progressInterval = setInterval(() => {
      setAnimatedProgress(prev => {
        const next = prev + increment
        if (Math.abs(next - targetProgress) < 0.5) {
          return targetProgress
        }
        return next
      })
    }, 50)

    return () => clearInterval(progressInterval)
  }, [progress, currentStepIndex, animatedProgress])

  // Rotate encouraging messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = encouragingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % encouragingMessages.length
        return encouragingMessages[nextIndex]
      })
    }, 4000)

    return () => clearInterval(messageInterval)
  }, [])

  // Sparkle animation
  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      setShowSparkles(prev => !prev)
    }, 1500)

    return () => clearInterval(sparkleInterval)
  }, [])

  const currentStepData = loadingSteps[currentStepIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating icons */}
        <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <Flame className="h-6 w-6 text-orange-300 opacity-60" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <Target className="h-5 w-5 text-purple-300 opacity-50" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
          <Zap className="h-7 w-7 text-yellow-300 opacity-40" />
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
          <Brain className="h-6 w-6 text-blue-300 opacity-55" />
        </div>
        
        {/* Sparkles */}
        {showSparkles && (
          <>
            <div className="absolute top-1/5 left-1/5 animate-ping">
              <div className="h-2 w-2 bg-yellow-400 rounded-full opacity-75"></div>
            </div>
            <div className="absolute top-2/3 right-1/5 animate-ping" style={{ animationDelay: '0.5s' }}>
              <div className="h-1.5 w-1.5 bg-pink-400 rounded-full opacity-75"></div>
            </div>
            <div className="absolute bottom-1/5 left-2/3 animate-ping" style={{ animationDelay: '1s' }}>
              <div className="h-2 w-2 bg-purple-400 rounded-full opacity-75"></div>
            </div>
          </>
        )}
      </div>

      {/* Two-column layout */}
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
        {/* Main loading content */}
        <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8">
            {/* Main roasting icon */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <Flame className="h-12 w-12 text-white animate-bounce" />
                </div>
                {/* Animated rings */}
                <div className="absolute inset-0 border-4 border-orange-200 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-2 border-2 border-red-200 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
              </div>
              
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Resume Roasting in Progress
              </h2>
              <p className="text-gray-600 text-lg">
                Our AI chef is preparing your feedback...
              </p>
            </div>

            {/* Current step indicator */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="animate-spin">
                  {currentStepData.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{currentStepData.text}</h3>
                  <p className="text-sm text-gray-600">{currentStepData.detail}</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Analysis Progress</span>
                <span className="text-sm text-gray-500">{Math.round(animatedProgress)}%</span>
              </div>
              <Progress 
                value={animatedProgress} 
                className="h-3 bg-gray-200"
              />
            </div>

            {/* Steps preview */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-2">
                {loadingSteps.slice(0, 6).map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-300 ${
                      index <= currentStepIndex 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : index === currentStepIndex + 1
                        ? 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    {index <= currentStepIndex ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Encouraging message */}
            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-700 font-medium animate-pulse">
                {currentMessage}
              </p>
            </div>

            {/* Time estimate */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                ⏱️ This usually takes 20-30 seconds for the best results
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mini-game sidebar */}
        <div className="space-y-6">
          <MiniGameHub />
          
          {/* Fun facts card */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <span>Did You Know?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p>75% of resumes never reach human eyes due to ATS filtering</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p>Recruiters spend an average of 6 seconds on initial resume review</p>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Quantified achievements increase interview chances by 40%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 