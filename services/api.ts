import { QuizAnswer, Lesson, LessonSummary, UserProfile, User } from '../types';

// --- MOCK DATABASE AND SEED DATA ---

const LESSON_SEED_DATA: Lesson[] = [
  {
    _id: "665f3a9e1e9b4d3e8c9c7f01",
    title: "Get Paid (Wage Negotiation)",
    description: "Ask for your wages, talk about payment timing, and avoid being cheated.",
    sourceLang: "Hindi",
    targetLang: "Kannada",
    phrases: [
      { _id: "p1", phraseId: "pay_1", sourceText: "Mujhe aaj ka pura paisa chahiye.", targetText: "Eega naanu ivattu saampaadisirolLa duddu beku.", sourceAudioUrl: "", targetAudioUrl: "" },
      { _id: "p2", phraseId: "pay_2", sourceText: "Aapne kal ka paisa nahi diya.", targetText: "Neenu ninna haana kodlilla.", sourceAudioUrl: "", targetAudioUrl: "" },
      { _id: "p3", phraseId: "pay_3", sourceText: "Kitna rate per din?", targetText: "Ondu dina ge eshtu karchu?", sourceAudioUrl: "", targetAudioUrl: "" }
    ],
    quiz: [
      { _id: "q1", questionText: "How do you say 'I need my full pay today' in Kannada?", correctAnswer: "Eega naanu ivattu saampaadisirolLa duddu beku.", options: ["Eega naanu ivattu saampaadisirolLa duddu beku.", "Ondu dina ge eshtu karchu?", "Neenu ninna haana kodlilla."] },
      { _id: "q2", questionText: "What is the Hindi meaning of 'Neenu ninna haana kodlilla'?", correctAnswer: "Aapne kal ka paisa nahi diya.", options: ["Kitna rate per din?", "Aapne kal ka paisa nahi diya.", "Tum kahan rehte ho?"] }
    ]
  },
  {
    _id: "665f3a9e1e9b4d3e8c9c7f02",
    title: "At The Clinic",
    description: "Explain your health issues to a doctor.",
    sourceLang: "Hindi",
    targetLang: "Kannada",
    phrases: [
        { _id: "p4", phraseId: "clinic_1", sourceText: "Mera pet dard kar raha hai.", targetText: "Nanna hotte novu maduttide.", sourceAudioUrl: "", targetAudioUrl: "" },
        { _id: "p5", phraseId: "clinic_2", sourceText: "Mujhe bukhar hai.", targetText: "Nanage jwara bandide.", sourceAudioUrl: "", targetAudioUrl: "" },
        { _id: "p6", phraseId: "clinic_3", sourceText: "Dawaai kahan milegi?", targetText: "Aushadhi elli siguttade?", sourceAudioUrl: "", targetAudioUrl: "" }
    ],
    quiz: [
        { _id: "q3", questionText: "How do you say 'I have a fever' in Kannada?", correctAnswer: "Nanage jwara bandide.", options: ["Nanna hotte novu maduttide.", "Nanage jwara bandide.", "Aushadhi elli siguttade?"] }
    ]
  },
    {
    _id: "665f3a9e1e9b4d3e8c9c7f03",
    title: "Renting a Room",
    description: "Talk to a landlord and ask about rent.",
    sourceLang: "Bengali",
    targetLang: "Marathi",
    phrases: [
        { _id: "p7", phraseId: "rent_1", sourceText: "Ekta ghor bhara chai.", targetText: "Mala ek खोली भाड्याने हवी आहे.", sourceAudioUrl: "", targetAudioUrl: "" },
        { _id: "p8", phraseId: "rent_2", sourceText: "Bhara koto?", targetText: "भाडे किती आहे?", sourceAudioUrl: "", targetAudioUrl: "" },
    ],
    quiz: [
        { _id: "q4", questionText: "How do you ask 'What is the rent?' in Marathi?", correctAnswer: "भाडे किती आहे?", options: ["Mala ek खोली भाड्याने हवी आहे.", "भाडे किती आहे?", "Jevan zal ka?"] }
    ]
  }
];

const MOCK_USERS_DB_KEY = 'setu_mock_users_db';

const getUsersFromStorage = (): any[] => {
    try {
        const db = localStorage.getItem(MOCK_USERS_DB_KEY);
        return db ? JSON.parse(db) : [];
    } catch (e) {
        return [];
    }
};

const saveUsersToStorage = (users: any[]) => {
    localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
};

// --- API MOCK IMPLEMENTATIONS ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiRegister = async (payload: { name: string, phoneOrEmail: string, sourceLang: string, targetLang: string }): Promise<{token: string, user: User}> => {
    await delay(500);
    const { name, phoneOrEmail, sourceLang, targetLang } = payload;
    let users = getUsersFromStorage();
    
    const newUser = {
        _id: `user_${Date.now()}`,
        name,
        phoneOrEmail,
        sourceLang,
        targetLang,
        progress: []
    };
    
    users.push(newUser);
    saveUsersToStorage(users);
    
    const token = newUser._id; // Use user ID as the token for mock purposes
    
    return Promise.resolve({
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            sourceLang: newUser.sourceLang,
            targetLang: newUser.targetLang
        }
    });
};

export const apiLogin = async (payload: any) => {
    await delay(500);
    return Promise.resolve({ error: "Login is disabled in this version." });
};

export const apiGetLessons = async (token: string): Promise<LessonSummary[]> => {
    await delay(500);
    if (!token) return Promise.resolve([]);
    
    const lessons = LESSON_SEED_DATA.map(({ _id, title, description, sourceLang, targetLang }) => ({
        _id, title, description, sourceLang, targetLang
    }));
    return Promise.resolve(lessons);
};

export const apiGetLesson = async (token: string, lessonId: string): Promise<Lesson | { error: string }> => {
    await delay(500);
    if (!token) return Promise.resolve({ error: "Auth token not provided" });
    
    const lesson = LESSON_SEED_DATA.find(l => l._id === lessonId);
    
    if (lesson) {
        return Promise.resolve(lesson);
    }
    return Promise.resolve({ error: "Lesson not found" });
};

export const apiSubmitQuiz = async (token: string, lessonId: string, score: number, answers: QuizAnswer[]) => {
    await delay(500);
    const userId = token; // Token is the user ID in this mock
    if (!userId) return Promise.resolve({ error: "Auth token not provided" });

    let users = getUsersFromStorage();
    const userIndex = users.findIndex(u => u._id === userId);

    if (userIndex === -1) {
        return Promise.resolve({ error: "User not found" });
    }

    const user = users[userIndex];
    const existingProgIndex = user.progress.findIndex((p: any) => p.lessonId === lessonId);

    if (existingProgIndex > -1) {
        user.progress[existingProgIndex].completed = true;
        user.progress[existingProgIndex].score = score;
    } else {
        user.progress.push({
            lessonId,
            completed: true,
            score
        });
    }

    users[userIndex] = user;
    saveUsersToStorage(users);
    
    return Promise.resolve({ message: "Progress saved", score });
};

export const apiGetProgress = async (token: string): Promise<UserProfile | { error: string }> => {
    await delay(500);
    const userId = token; // Token is the user ID
    if (!userId) return Promise.resolve({ error: "Auth token not provided" });

    const users = getUsersFromStorage();
    const user = users.find((u: any) => u._id === userId);

    if (!user) {
        return Promise.resolve({ error: "User not found" });
    }

    const progressWithTitles = user.progress.map((p: any) => {
        const lesson = LESSON_SEED_DATA.find(l => l._id === p.lessonId);
        return {
            ...p,
            lessonTitle: lesson ? lesson.title : "Unknown Lesson"
        };
    });

    return Promise.resolve({
        name: user.name,
        sourceLang: user.sourceLang,
        targetLang: user.targetLang,
        progress: progressWithTitles
    });
};