
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetLesson, apiSubmitQuiz } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Lesson, Question, QuizAnswer } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const QuizScreen: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLesson = async () => {
            if (!auth.token || !lessonId) return;
            setLoading(true);
            try {
                const data = await apiGetLesson(auth.token, lessonId);
                // Fix: Restructure logic to safely handle union type by checking for error first.
                if (data && 'error' in data) {
                    setError(data.error || 'Quiz not available for this lesson.');
                } else if (data?.quiz?.length > 0) {
                    setLesson(data);
                } else {
                    setError('Quiz not available for this lesson.');
                }
            } catch (err) {
                setError('Failed to fetch quiz.');
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [auth.token, lessonId]);

    const handleNextQuestion = () => {
        if (selectedAnswer === null) return;

        const currentQuestion = lesson!.quiz[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        
        setAnswers(prev => [...prev, {
            questionText: currentQuestion.questionText,
            chosenAnswer: selectedAnswer,
            correct: isCorrect,
        }]);

        setSelectedAnswer(null);

        if (currentQuestionIndex < lesson!.quiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };
    
    const finishQuiz = async () => {
        setSubmitting(true);
        const finalAnswers = [...answers];
        // Add the last answer
        const lastQuestion = lesson!.quiz[currentQuestionIndex];
        if(selectedAnswer) {
             finalAnswers.push({
                questionText: lastQuestion.questionText,
                chosenAnswer: selectedAnswer,
                correct: selectedAnswer === lastQuestion.correctAnswer,
            });
        }
       
        const score = Math.round((finalAnswers.filter(a => a.correct).length / finalAnswers.length) * 100);

        try {
            if (auth.token && lessonId) {
                await apiSubmitQuiz(auth.token, lessonId, score, finalAnswers);
                navigate(`/results/${lessonId}`, { state: { score, answers: finalAnswers } });
            }
        } catch (err) {
            setError("Failed to submit quiz results.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!lesson) return <p className="text-center">Quiz loaded incorrectly.</p>;

    const question: Question = lesson.quiz[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / lesson.quiz.length) * 100;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{lesson.title} - Quiz</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="mb-6">
                <p className="text-lg font-semibold text-gray-700">{question.questionText}</p>
            </div>

            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedAnswer(option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 ${
                            selectedAnswer === option
                                ? 'bg-sky-500 border-sky-600 text-white font-bold'
                                : 'bg-white border-gray-300 hover:bg-sky-100 hover:border-sky-300'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null || submitting}
                className="w-full mt-8 py-3 px-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
                {submitting ? 'Submitting...' : (currentQuestionIndex < lesson.quiz.length - 1 ? 'Next' : 'Finish Quiz')}
            </button>
        </div>
    );
};

export default QuizScreen;