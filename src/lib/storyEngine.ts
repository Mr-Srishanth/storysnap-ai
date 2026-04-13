// ==========================================
// StorySnap AI — Cinematic Story Engine v3
// Short, emotional, powerful stories (5-7 lines)
// ==========================================

export type StoryStyle = "story" | "funny" | "cinematic" | "teacher";
export type ExplainLevel = "child" | "student" | "developer";
export type Language = "en" | "hi" | "te";

export interface GeneratedStory {
  title: string;
  story: string;
  summary: string;
  keyLesson: string;
  realLifeExample: string;
  quiz: { question: string; options: string[]; correct: number };
  nextTopics: string[];
}

// --------------- DATA POOLS ---------------

const characters = [
  "Leo", "Spark", "Maya", "Orion", "Nova", "Riley", "Fynn", "Zara",
  "Pip", "Luna", "Kai", "Gizmo", "Sage", "Melody", "Echo",
  "Whiskers", "Marina", "Atlas", "Frost", "Splash", "Hoot",
];

const settings = [
  "a quiet village", "a tiny spaceship", "a colorful school", "a magical forest",
  "a giant computer", "a coral city underwater", "a floating island", "a futuristic city",
  "a never-ending library", "a crystal cave", "a dimension-hopping train",
  "a treehouse in a storm", "a desert lab", "a living snowglobe",
  "a star-sailing pirate ship", "a whispering garden", "a teaching carnival",
  "a café at the universe's edge", "a painting that came alive",
];

// --------------- UTILITY ---------------

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectTopicType(topic: string): "tech" | "science" | "general" {
  const t = topic.toLowerCase();
  const techWords = ["ai", "blockchain", "crypto", "code", "programming", "software", "algorithm", "data", "internet", "web", "api", "machine learning", "neural", "computer", "database", "cloud", "server", "network", "iot", "app"];
  const scienceWords = ["physics", "quantum", "atom", "molecule", "biology", "chemistry", "evolution", "dna", "gene", "cell", "gravity", "relativity", "energy", "photosynthesis", "climate", "planet", "space", "black hole", "dark matter", "ecosystem"];
  if (techWords.some(w => t.includes(w))) return "tech";
  if (scienceWords.some(w => t.includes(w))) return "science";
  return "general";
}

// --------------- ANALOGY POOLS ---------------

const analogies: Record<string, string[]> = {
  tech: [
    "sending a letter through a chain of mailmen 📬",
    "a filing cabinet that organizes itself 🗄️",
    "traffic lights directing cars on a highway 🚦",
    "a recipe a super-fast chef follows step by step 👨‍🍳",
    "invisible pipes carrying water to the right faucet 🚿",
    "a translator who speaks every language at once 🌐",
  ],
  science: [
    "tiny Lego bricks building everything you see 🧱",
    "a garden where each seed has its own schedule 🌱",
    "invisible strings pulling on the whole universe 🎻",
    "a river that always finds the easiest path downhill 🏞️",
    "magnets picking their friends 🧲",
    "dominos falling in a perfectly planned chain ⛓️",
  ],
  general: [
    "a puzzle where each piece clicks into place 🧩",
    "building blocks stacking one on top of another 🧱",
    "a game where you level up step by step 🎮",
    "learning to ride a bike — wobbly, then amazing 🚲",
    "peeling an onion — one layer reveals the next 🧅",
    "tuning a radio until the music becomes clear 📻",
  ],
};

// --------------- OPENING ENGINE (never repeat) ---------------

type OpeningType = "dialogue" | "scene" | "action" | "question";
let lastOpening: OpeningType | null = null;

function getOpening(char: string, setting: string, topic: string): string {
  const openings: { type: OpeningType; text: string }[] = [
    { type: "dialogue", text: `"I just don't get ${topic}," sighed ${char}, sitting in ${setting}.` },
    { type: "scene", text: `It was a strange morning in ${setting}. ${char} had one mission — understand ${topic}.` },
    { type: "action", text: `${char} grabbed a notebook, wrote "${topic}" in big letters, and dove in.` },
    { type: "question", text: `What if ${topic} was simpler than everyone made it sound? ${char} had to find out.` },
  ];
  const available = openings.filter(o => o.type !== lastOpening);
  const chosen = pick(available);
  lastOpening = chosen.type;
  return chosen.text;
}

// --------------- STYLE TEMPLATES (cinematic, 5-7 lines) ---------------

function buildStory(topic: string, style: StoryStyle, level: ExplainLevel): string {
  const char = pick(characters);
  const setting = pick(settings);
  const topicType = detectTopicType(topic);
  const analogy = pick(analogies[topicType] || analogies.general);

  const hook = getOpening(char, setting, topic);

  // Conflict line
  const conflicts = [
    `Every explanation felt like another puzzle. 😕`,
    `The more ${char} read, the more lost they got.`,
    `Nobody could explain it simply. 🤯`,
    `It felt like catching smoke with bare hands.`,
  ];

  // Curiosity bridge
  const curiosity = [
    `Then someone said: "What if ${topic} is just like ${analogy}?"`,
    `A friend whispered: "Think of it as ${analogy}."`,
    `Then it hit — ${topic} is basically ${analogy}.`,
  ];

  // Aha moment (mandatory)
  const aha = `💡 And suddenly… it clicked.`;

  // Resolution by level
  const resolutions: Record<ExplainLevel, string[]> = {
    child: [
      `${topic} is just ${analogy} — super simple when you see it right! 🎉`,
      `It's like magic, but real — and now ${char} could explain it to anyone! ✨`,
    ],
    student: [
      `${topic} follows a clear pattern — once you find the right angle, complexity melts away.`,
      `Breaking ${topic} into small pieces made each part click perfectly.`,
    ],
    developer: [
      `At its core, ${topic} is an elegant system — ${analogy}. Pattern recognized, concept unlocked. 🔓`,
      `${topic} maps to a familiar model: ${analogy}. Architecture understood.`,
    ],
  };

  // Style flavoring
  const styleLine = getStyleLine(style, char, topic);

  const conflict = pick(conflicts);
  const bridge = pick(curiosity);
  const resolution = pick(resolutions[level]);

  // Assemble (5-7 lines)
  const lines = [hook, conflict, bridge, aha, styleLine, resolution].filter(Boolean);
  return lines.join("\n\n");
}

function getStyleLine(style: StoryStyle, char: string, topic: string): string {
  switch (style) {
    case "story":
      return pick([
        `${char}'s eyes lit up — the mystery of ${topic} wasn't so scary after all. 📖`,
        `Like a story unfolding page by page, ${topic} finally made sense. ✨`,
      ]);
    case "funny":
      return pick([
        `${char} laughed — understanding ${topic} was easier than folding a fitted sheet! 😂`,
        `"Wait, THAT'S it?!" ${char} face-palmed so hard the whole room heard it. 🤦‍♂️`,
        `Turns out ${topic} was simpler than teaching a cat to sit. 🐱😂`,
      ]);
    case "cinematic":
      return pick([
        `Time slowed. The fog lifted. ${char} saw ${topic} with crystal clarity. 🎬`,
        `The camera zooms in — ${char}'s face transforms from confusion to wonder. 🎥`,
      ]);
    case "teacher":
      return pick([
        `"Let me break this down," ${char} said, suddenly becoming the teacher. 👨‍🏫`,
        `Step by step, ${char} mapped out ${topic} like a pro explaining it to a friend. 📋`,
      ]);
  }
}

// --------------- QUIZ GENERATOR ---------------

function generateQuiz(topic: string, analogy: string): { question: string; options: string[]; correct: number } {
  const quizzes = [
    {
      question: `What's a good way to think about ${topic}?`,
      options: [`It's like ${analogy.replace(/\s*[^\w\s].?$/, "")}`, `It's completely random`, `Nobody can understand it`, `It has no real pattern`],
      correct: 0,
    },
    {
      question: `What's the first step to understanding ${topic}?`,
      options: [`Memorize everything`, `Find a simple comparison`, `Give up and move on`, `Read a 500-page book`],
      correct: 1,
    },
    {
      question: `Why do complex topics feel hard at first?`,
      options: [`They're actually impossible`, `We haven't found the right angle yet`, `Only geniuses can learn them`, `They require special tools`],
      correct: 1,
    },
  ];
  return pick(quizzes);
}

// --------------- NEXT TOPICS ---------------

const suggestedTopics = [
  "Artificial Intelligence", "Blockchain", "Quantum Physics", "Machine Learning",
  "Black Holes", "DNA & Genetics", "Cryptocurrency", "Neural Networks",
  "Climate Change", "Relativity", "Evolution", "Internet of Things",
  "Photosynthesis", "Supply & Demand", "Algorithms", "Dark Matter",
  "Cybersecurity", "Cloud Computing", "Big Data", "Renewable Energy",
];

function getNextTopics(currentTopic: string): string[] {
  const filtered = suggestedTopics.filter(t => t.toLowerCase() !== currentTopic.toLowerCase());
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// --------------- MULTI-LANGUAGE ---------------

const translations: Record<Language, { learnedIt: string; stillConfused: string; nextUp: string }> = {
  en: { learnedIt: "✅ You learned something!", stillConfused: "Still confused? Ask anything…", nextUp: "Try next:" },
  hi: { learnedIt: "✅ आपने कुछ नया सीखा!", stillConfused: "अभी भी confused? कुछ भी पूछो…", nextUp: "अगला:" },
  te: { learnedIt: "✅ మీరు ఏదైనా నేర్చుకున్నారు!", stillConfused: "ఇంకా అర్థం కాలేదా? ఏదైనా అడగండి…", nextUp: "తదుపరి:" },
};

// --------------- REAL-LIFE EXAMPLES ---------------

function generateRealLifeExample(topic: string, type: string): string {
  const t = topic.toLowerCase();
  const techExamples: Record<string, string> = {
    "ai": "Netflix suggesting your next binge — that's AI predicting your taste. 🎬",
    "blockchain": "A shared Google Doc nobody can secretly edit — that's blockchain. 📄",
    "machine learning": "Your spam filter learning which emails are junk — that's ML! 📧",
    "algorithm": "Following a recipe step-by-step to bake a cake — that's an algorithm. 🎂",
  };
  const scienceExamples: Record<string, string> = {
    "quantum": "Your phone's GPS uses quantum physics — without it, maps would be off by miles! 📍",
    "dna": "DNA is your body's instruction manual — eye color, height, everything. 🧬",
    "gravity": "Every time you drop your phone — that's gravity doing its thing! 📱",
    "evolution": "Dog breeds: from chihuahuas to Great Danes — that's evolution in action. 🐕",
  };

  const pool = type === "tech" ? techExamples : type === "science" ? scienceExamples : {};
  for (const key of Object.keys(pool)) {
    if (t.includes(key)) return pool[key];
  }

  return pick([
    `Your phone uses principles of ${topic} right now — you just don't notice. 📱`,
    `Next time you search online, ${topic} is working behind the scenes. ⚡`,
    `The weather app on your phone? Closely related to ${topic}. 🌤️`,
  ]);
}

// --------------- MAIN GENERATOR ---------------

export function generateStory(
  topic: string,
  style: StoryStyle,
  level: ExplainLevel = "student",
  _lang: Language = "en"
): GeneratedStory {
  const topicType = detectTopicType(topic);
  const analogy = pick(analogies[topicType] || analogies.general);

  const story = buildStory(topic, style, level);

  const summaries = [
    `${topic} is essentially ${analogy.replace(/like /i, "").replace(/\s*[^\w\s].?$/, "")}. Simple when you find the right angle.`,
    `Break ${topic} into small pieces — each one makes perfect sense on its own.`,
    `The secret? Find the right comparison. Connect it to something familiar.`,
  ];

  const lessons = [
    `Even the trickiest ideas become clear with the right perspective. 💡`,
    `Understanding ${topic} isn't about being smart — it's about finding the right story. 📖`,
    `Every expert was once confused. Curiosity is the only prerequisite. 🔍`,
  ];

  return {
    title: `The Story of ${topic}`,
    story,
    summary: pick(summaries),
    keyLesson: pick(lessons),
    realLifeExample: generateRealLifeExample(topic, topicType),
    quiz: generateQuiz(topic, analogy),
    nextTopics: getNextTopics(topic),
  };
}

export function generateSimplerVersion(_story: GeneratedStory, topic: string): GeneratedStory {
  return generateStory(topic, "funny", "child");
}

export { suggestedTopics, translations };

