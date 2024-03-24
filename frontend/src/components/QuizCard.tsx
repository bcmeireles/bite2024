// QuizCard.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import background from '../background.svg';
import Navbar from './navbar/Navbar';

interface Quiz {
  question: string;
  answers: string[];
  unit: number;
}

interface QuizCardProps {
  unit: number;
}

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const QuizCard: React.FC<QuizCardProps> = ({ unit }) => {
  const [quizIndex, setQuizIndex] = useState(0);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [answerSelected, setAnswerSelected] = useState<boolean | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shuffledAnswers = useMemo(() => {
    console.log(currentQuiz);
    if (currentQuiz) {
      return shuffleArray([...currentQuiz.answers]);
    }
    return [];
  }, [currentQuiz]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://localhost:5000/quizzes/' + unit);

        if (!response.ok) {
          throw new Error('Error fetching quizzes');
        }

        const data = await response.json();
        setQuizzes(data);
        setCurrentQuiz(data[quizIndex]);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, [quizIndex]);

  if (!currentQuiz) {
    return <div>Loading...</div>;
  }

  const handleChoiceClick = (choice: string) => {
    setSelectedChoice(choice);
    setAnswerSelected(choice === currentQuiz.answers[0]);
  
    if (choice === currentQuiz.answers[0]) {
      if (quizIndex === quizzes.length - 1) {
        console.log("finished");
        const token = localStorage.getItem('token');
        
        fetch('http://localhost:5000/quizzes/' + (unit - 1), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        setTimeout(() => {
          window.location.href = "/learn"
        }, 300);


      } else {
        timeoutRef.current = setTimeout(() => {
          setQuizIndex(quizIndex + 1);
          setAnswerSelected(null);
          setSelectedChoice(null);
        }, 1000);
      }
    } else {
      setTimeout(() => {
        setSelectedChoice(null);
        setAnswerSelected(null);
      }, 1000);
    }
  };

  const choiceClassName = (choice: string) =>
    clsx('cursor-pointer py-2 border-b', {
      'bg-green-200': answerSelected && choice === currentQuiz.answers[0],
      'animate-shake': choice !== currentQuiz.answers[0] && selectedChoice === choice,
      'bg-red-200': choice !== currentQuiz.answers[0] && selectedChoice === choice,
      'bg-white': !answerSelected && !selectedChoice,
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-8">
            <img src={background} alt="Waves" className="absolute bottom-0 left-0 w-full h-full" />
            <div className="z-10 w-full">
            <Navbar selected={1} />
          <h1 className="text-2xl font-bold mb-4 text-center">Unit {unit} Quiz</h1>
          <div className="flex justify-end w-full mb-8">
            <p className="text-lg font-semibold">
              {quizIndex + 1}/{quizzes.length}
            </p>
          </div>
          <div className="w-full max-w-5xl"> {/* Set maximum width to 5xl (70% of the screen) */}
            <div className="p-4 rounded-lg shadow-lg bg-white mb-4">
              <h2 className="text-xl font-bold mb-4 text-center">{currentQuiz.question}</h2>
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-white">
              <ul>
                {shuffledAnswers.map((choice, index) => (
                  <li key={index} onClick={() => handleChoiceClick(choice)}>
                    <div className={choiceClassName(choice)}>{choice}</div>
                  </li>
                ))}
              </ul>
            </div>
            </div>
          </div>
          </div>
      );
    };
    
    export default QuizCard;