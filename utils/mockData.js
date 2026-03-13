const mockUser = {
  name: 'Tanaka',
  fullName: 'Tanaka Taro',
  email: 'tanaka@example.com',
  targetLevel: 'N3',
  xp: 2450,
  xpMax: 3000,
  streak: 7,
  energyLevel: 98,
  totalTests: 24,
  avgScore: 78,
  timeSpent: '12h',
  passedExams: 18,
  overallScore: 78,
};

const jlptLevels = [
  {
    id: 'n5',
    level: 'N5',
    title: 'JLPT N5',
    difficulty: 'Beginner Level',
    description: 'Able to understand basic Japanese',
    questions: 100,
    timeMinutes: 105,
    passingScore: 60,
    sections: [
      { name: 'Language Knowledge (Vocabulary)', questions: 30, timeMinutes: 26 },
      { name: 'Language Knowledge (Grammar)', questions: 30, timeMinutes: 26 },
      { name: 'Reading', questions: 25, timeMinutes: 36 },
      { name: 'Listening', questions: 15, timeMinutes: 15 },
    ],
  },
  {
    id: 'n4',
    level: 'N4',
    title: 'JLPT N4',
    difficulty: 'Elementary Level',
    description: 'Able to understand basic Japanese',
    questions: 125,
    timeMinutes: 125,
    passingScore: 60,
    sections: [
      { name: 'Language Knowledge (Vocabulary)', questions: 35, timeMinutes: 30 },
      { name: 'Language Knowledge (Grammar)', questions: 35, timeMinutes: 30 },
      { name: 'Reading', questions: 30, timeMinutes: 40 },
      { name: 'Listening', questions: 25, timeMinutes: 25 },
    ],
  },
  {
    id: 'n3',
    level: 'N3',
    title: 'JLPT N3',
    difficulty: 'Intermediate Level',
    description: 'Able to understand Japanese used in everyday situations to a certain degree',
    questions: 140,
    timeMinutes: 140,
    passingScore: 60,
    sections: [
      { name: 'Language Knowledge (Vocabulary)', questions: 40, timeMinutes: 35 },
      { name: 'Language Knowledge (Grammar)', questions: 35, timeMinutes: 35 },
      { name: 'Reading', questions: 35, timeMinutes: 40 },
      { name: 'Listening', questions: 30, timeMinutes: 30 },
    ],
  },
  {
    id: 'n2',
    level: 'N2',
    title: 'JLPT N2',
    difficulty: 'Advanced Level',
    description: 'Able to understand Japanese used in everyday situations, and in a variety of circumstances to a certain degree',
    questions: 155,
    timeMinutes: 155,
    passingScore: 60,
    sections: [
      { name: 'Language Knowledge (Vocabulary)', questions: 45, timeMinutes: 40 },
      { name: 'Language Knowledge (Grammar)', questions: 40, timeMinutes: 40 },
      { name: 'Reading', questions: 35, timeMinutes: 40 },
      { name: 'Listening', questions: 35, timeMinutes: 35 },
    ],
  },
  {
    id: 'n1',
    level: 'N1',
    title: 'JLPT N1',
    difficulty: 'Expert Level',
    description: 'Able to understand Japanese used in a variety of circumstances',
    questions: 170,
    timeMinutes: 170,
    passingScore: 60,
    sections: [
      { name: 'Language Knowledge (Vocabulary)', questions: 50, timeMinutes: 45 },
      { name: 'Language Knowledge (Grammar)', questions: 45, timeMinutes: 45 },
      { name: 'Reading', questions: 40, timeMinutes: 45 },
      { name: 'Listening', questions: 35, timeMinutes: 35 },
    ],
  },
];

const mockQuestions = {
  n5: [
    {
      id: 1,
      text: '私は毎日日本語を＿＿＿＿＿。',
      options: [
        { label: 'A', text: '勉強します' },
        { label: 'B', text: '勉強した' },
        { label: 'C', text: '勉強する' },
        { label: 'D', text: '勉強している' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 2,
      text: 'これは＿＿＿＿＿本ですか。',
      options: [
        { label: 'A', text: 'だれの' },
        { label: 'B', text: 'だれ' },
        { label: 'C', text: 'どれの' },
        { label: 'D', text: 'なにの' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 3,
      text: '昨日、友達＿＿＿＿＿映画を見ました。',
      options: [
        { label: 'A', text: 'を' },
        { label: 'B', text: 'と' },
        { label: 'C', text: 'に' },
        { label: 'D', text: 'で' },
      ],
      correctAnswer: 'B',
    },
    {
      id: 4,
      text: '駅＿＿＿＿＿バスに乗ります。',
      options: [
        { label: 'A', text: 'に' },
        { label: 'B', text: 'を' },
        { label: 'C', text: 'で' },
        { label: 'D', text: 'と' },
      ],
      correctAnswer: 'C',
    },
    {
      id: 5,
      text: 'この部屋は＿＿＿＿＿です。',
      options: [
        { label: 'A', text: '広い' },
        { label: 'B', text: '広く' },
        { label: 'C', text: '広くて' },
        { label: 'D', text: '広さ' },
      ],
      correctAnswer: 'A',
    },
  ],
  n4: [
    {
      id: 1,
      text: '明日は雨が降る＿＿＿＿＿、傘を持っていきます。',
      options: [
        { label: 'A', text: 'ので' },
        { label: 'B', text: 'から' },
        { label: 'C', text: 'けど' },
        { label: 'D', text: 'のに' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 2,
      text: '漢字が読める＿＿＿＿＿になりました。',
      options: [
        { label: 'A', text: 'こと' },
        { label: 'B', text: 'よう' },
        { label: 'C', text: 'もの' },
        { label: 'D', text: 'ため' },
      ],
      correctAnswer: 'B',
    },
    {
      id: 3,
      text: '先生に＿＿＿＿＿から、よく分かりました。',
      options: [
        { label: 'A', text: '教えてもらった' },
        { label: 'B', text: '教えてあげた' },
        { label: 'C', text: '教えてくれた' },
        { label: 'D', text: '教えられた' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 4,
      text: '日本に行った＿＿＿＿＿があります。',
      options: [
        { label: 'A', text: 'もの' },
        { label: 'B', text: 'こと' },
        { label: 'C', text: 'ところ' },
        { label: 'D', text: 'ため' },
      ],
      correctAnswer: 'B',
    },
    {
      id: 5,
      text: '窓を＿＿＿＿＿ままで寝てしまいました。',
      options: [
        { label: 'A', text: '開く' },
        { label: 'B', text: '開けた' },
        { label: 'C', text: '開いた' },
        { label: 'D', text: '開けて' },
      ],
      correctAnswer: 'B',
    },
  ],
  n3: [
    {
      id: 1,
      text: '彼は何も言わず＿＿＿＿＿帰ってしまった。',
      options: [
        { label: 'A', text: 'に' },
        { label: 'B', text: 'で' },
        { label: 'C', text: 'と' },
        { label: 'D', text: 'を' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 2,
      text: 'この問題は難し＿＿＿＿＿、誰も解けなかった。',
      options: [
        { label: 'A', text: 'すぎて' },
        { label: 'B', text: 'すぎる' },
        { label: 'C', text: 'すぎた' },
        { label: 'D', text: 'すぎ' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 3,
      text: '天気予報＿＿＿＿＿よると、明日は晴れるそうです。',
      options: [
        { label: 'A', text: 'に' },
        { label: 'B', text: 'で' },
        { label: 'C', text: 'と' },
        { label: 'D', text: 'から' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 4,
      text: '彼女は医者になる＿＿＿＿＿、毎日勉強している。',
      options: [
        { label: 'A', text: 'ために' },
        { label: 'B', text: 'ように' },
        { label: 'C', text: 'ことに' },
        { label: 'D', text: 'ものに' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 5,
      text: '電車が遅れた＿＿＿＿＿、会議に間に合わなかった。',
      options: [
        { label: 'A', text: 'せいで' },
        { label: 'B', text: 'おかげで' },
        { label: 'C', text: 'ために' },
        { label: 'D', text: 'ように' },
      ],
      correctAnswer: 'A',
    },
  ],
  n2: [
    {
      id: 1,
      text: '努力した＿＿＿＿＿、試験に落ちてしまった。',
      options: [
        { label: 'A', text: 'にもかかわらず' },
        { label: 'B', text: 'おかげで' },
        { label: 'C', text: 'せいで' },
        { label: 'D', text: 'ために' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 2,
      text: '彼の説明を聞いた＿＿＿＿＿、よく分からなかった。',
      options: [
        { label: 'A', text: 'ものの' },
        { label: 'B', text: 'ものを' },
        { label: 'C', text: 'ものだ' },
        { label: 'D', text: 'ものか' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 3,
      text: 'この仕事は私＿＿＿＿＿できません。',
      options: [
        { label: 'A', text: 'には' },
        { label: 'B', text: 'でも' },
        { label: 'C', text: 'だけ' },
        { label: 'D', text: 'しか' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 4,
      text: '彼は社長＿＿＿＿＿、とても謙虚な人だ。',
      options: [
        { label: 'A', text: 'でありながら' },
        { label: 'B', text: 'であるから' },
        { label: 'C', text: 'であるので' },
        { label: 'D', text: 'であっても' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 5,
      text: '環境問題について考えない＿＿＿＿＿にはいかない。',
      options: [
        { label: 'A', text: 'わけ' },
        { label: 'B', text: 'こと' },
        { label: 'C', text: 'もの' },
        { label: 'D', text: 'ため' },
      ],
      correctAnswer: 'A',
    },
  ],
  n1: [
    {
      id: 1,
      text: '彼の行動は理解し＿＿＿＿＿。',
      options: [
        { label: 'A', text: 'がたい' },
        { label: 'B', text: 'やすい' },
        { label: 'C', text: 'にくい' },
        { label: 'D', text: 'っぽい' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 2,
      text: '彼女は美しさ＿＿＿＿＿、知性も兼ね備えている。',
      options: [
        { label: 'A', text: 'もさることながら' },
        { label: 'B', text: 'はともかく' },
        { label: 'C', text: 'にかかわらず' },
        { label: 'D', text: 'をものともせず' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 3,
      text: '準備が整い＿＿＿＿＿、出発しましょう。',
      options: [
        { label: 'A', text: '次第' },
        { label: 'B', text: 'ながら' },
        { label: 'C', text: 'つつ' },
        { label: 'D', text: 'がてら' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 4,
      text: '社長の決定＿＿＿＿＿、我々は従うしかない。',
      options: [
        { label: 'A', text: 'とあれば' },
        { label: 'B', text: 'とすれば' },
        { label: 'C', text: 'としたら' },
        { label: 'D', text: 'となると' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 5,
      text: 'あの人は口では優しいことを言い＿＿＿＿＿、実際は冷たい。',
      options: [
        { label: 'A', text: 'つつも' },
        { label: 'B', text: 'ながらも' },
        { label: 'C', text: 'ものの' },
        { label: 'D', text: 'くせに' },
      ],
      correctAnswer: 'A',
    },
  ],
};

const recentActivity = [
  { id: 1, name: 'JLPT N3 Grammar Test', status: 'Pass', date: '2026-01-08', score: 85 },
  { id: 2, name: 'JLPT N3 Vocabulary Test', status: 'Pass', date: '2026-01-07', score: 72 },
  { id: 3, name: 'JLPT N4 Reading Test', status: 'Fail', date: '2026-01-05', score: 55 },
];

const recommendedTests = [
  { id: 1, level: 'N3', name: 'N3 Grammar Part 2', questions: 40, timeMinutes: 45 },
  { id: 2, level: 'N3', name: 'N3 Reading Practice', questions: 35, timeMinutes: 60 },
  { id: 3, level: 'N2', name: 'N2 Vocabulary Test', questions: 50, timeMinutes: 50 },
];

const testResults = [
  { id: 1, level: 'N3', name: 'JLPT N3 Complete Test', status: 'Pass', score: 85, correct: 119, total: 140, date: '2026-01-08' },
  { id: 2, level: 'N3', name: 'JLPT N3 Grammar Test', status: 'Pass', score: 72, correct: 29, total: 40, date: '2026-01-07' },
  { id: 3, level: 'N4', name: 'JLPT N4 Reading Test', status: 'Fail', score: 55, correct: 19, total: 35, date: '2026-01-05' },
  { id: 4, level: 'N3', name: 'JLPT N3 Vocabulary Test', status: 'Pass', score: 78, correct: 39, total: 50, date: '2026-01-03' },
  { id: 5, level: 'N4', name: 'JLPT N4 Complete Test', status: 'Pass', score: 88, correct: 110, total: 125, date: '2025-12-30' },
  { id: 6, level: 'N3', name: 'JLPT N3 Listening Test', status: 'Pass', score: 65, correct: 20, total: 30, date: '2025-12-28' },
];

const achievements = [
  { id: 1, emoji: '🏆', name: 'First Test' },
  { id: 2, emoji: '🔥', name: '7 Day Streak' },
  { id: 3, emoji: '⭐', name: 'High Scorer' },
];

const levelColors = {
  n5: '#FBCB8B',
  n4: '#F5AD5A',
  n3: '#F09A3E',
  n2: '#E07D1A',
  n1: '#C46A0A',
};

module.exports = {
  mockUser,
  jlptLevels,
  mockQuestions,
  recentActivity,
  recommendedTests,
  testResults,
  achievements,
  levelColors,
};
