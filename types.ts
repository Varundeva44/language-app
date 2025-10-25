
export interface User {
    id: string;
    name: string;
    sourceLang: string;
    targetLang: string;
}

export interface Phrase {
    phraseId: string;
    sourceText: string;
    targetText: string;
    sourceAudioUrl: string;
    targetAudioUrl: string;
    _id: string;
}

export interface Question {
    questionText: string;
    correctAnswer: string;
    options: string[];
    _id: string;
}

export interface LessonSummary {
    _id: string;
    title: string;
    description: string;
    sourceLang: string;
    targetLang: string;
}

export interface Lesson extends LessonSummary {
    phrases: Phrase[];
    quiz: Question[];
}

export interface UserProgressItem {
    lessonId: string;
    lessonTitle: string;
    completed: boolean;
    score: number;
}

export interface UserProfile {
    name: string;
    sourceLang: string;
    targetLang: string;
    progress: UserProgressItem[];
}

export interface QuizAnswer {
    questionText: string;
    chosenAnswer: string;
    correct: boolean;
}
