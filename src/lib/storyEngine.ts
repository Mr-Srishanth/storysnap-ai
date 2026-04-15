// ==========================================
// StorySnap AI — Scene-Based Story Engine v5
// ==========================================

export type StoryStyle = "story" | "funny" | "cinematic" | "teacher";
export type ExplainLevel = "child" | "student" | "developer";
export type Language = "en" | "hi" | "te";

export interface StoryScene {
  title: string;
  description: string;
  narration: string;
  imagePrompt: string;
  emoji: string;
}

export interface GeneratedStory {
  title: string;
  story: string;
  scenes: StoryScene[];
  summary: string;
  keyLesson: string;
  realLifeExample: string;
  quiz: { question: string; options: string[]; correct: number };
  nextTopics: string[];
  language: Language;
}

// --------------- DATA POOLS ---------------

const characters = [
  "Leo", "Spark", "Maya", "Orion", "Nova", "Riley", "Fynn", "Zara",
  "Pip", "Luna", "Kai", "Sage", "Melody", "Echo", "Marina", "Atlas",
  "Ravi", "Priya", "Arjun", "Neha", "Kira", "Dante", "Siri", "Jin",
];

const settings = [
  "a quiet rooftop at sunset", "a buzzing coffee shop", "a dusty old library",
  "a train rushing through the night", "a garden after the rain",
  "a tiny boat on a calm lake", "a classroom after hours",
  "a park bench on a windy day", "a kitchen at midnight",
  "a starlit balcony", "a crowded marketplace", "a workshop full of tools",
];

// --------------- UTILITY ---------------

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function detectTopicType(topic: string): "tech" | "science" | "general" {
  const t = topic.toLowerCase();
  const techWords = ["ai", "blockchain", "crypto", "code", "programming", "software", "algorithm", "data", "internet", "web", "api", "machine learning", "neural", "computer", "database", "cloud", "server", "network", "iot", "app", "cybersecurity"];
  const scienceWords = ["physics", "quantum", "atom", "molecule", "biology", "chemistry", "evolution", "dna", "gene", "cell", "gravity", "relativity", "energy", "photosynthesis", "climate", "planet", "space", "black hole", "dark matter", "ecosystem"];
  if (techWords.some(w => t.includes(w))) return "tech";
  if (scienceWords.some(w => t.includes(w))) return "science";
  return "general";
}

// --------------- ANALOGY POOLS ---------------

const analogies: Record<string, string[]> = {
  tech: [
    "sending a letter through a chain of mailmen",
    "a filing cabinet that organizes itself",
    "traffic lights directing cars on a highway",
    "a recipe a super-fast chef follows step by step",
    "a librarian who remembers every book ever written",
  ],
  science: [
    "tiny Lego bricks building everything you see",
    "a garden where each seed has its own schedule",
    "invisible strings pulling on the whole universe",
    "a river that always finds the easiest path downhill",
    "dominos falling in a perfectly planned chain",
  ],
  general: [
    "a puzzle where each piece clicks into place",
    "building blocks stacking one on top of another",
    "learning to ride a bike — wobbly at first, then effortless",
    "tuning a radio until the static becomes music",
    "connecting the dots — the picture appears suddenly",
  ],
};

// --------------- SCENE BUILDERS ---------------

const sceneEmojis = ["🌅", "🤔", "💡", "✨", "🎉"];

function buildScenes(topic: string, style: StoryStyle, level: ExplainLevel, lang: Language): StoryScene[] {
  const char = pick(characters);
  const setting = pick(settings);
  const topicType = detectTopicType(topic);
  const analogy = pick(analogies[topicType] || analogies.general);

  if (lang === "hi") return buildHindiScenes(topic, style, char, analogy);
  if (lang === "te") return buildTeluguScenes(topic, style, char, analogy);

  const styleTone = {
    story: { adj: "curious", verb: "wondered" },
    funny: { adj: "bewildered", verb: "groaned" },
    cinematic: { adj: "intense", verb: "stared" },
    teacher: { adj: "focused", verb: "asked" },
  }[style];

  return [
    {
      title: "The Question",
      description: `${char} sat in ${setting}, ${styleTone.adj}. "What exactly is ${topic}?" ${char} ${styleTone.verb}.`,
      narration: `${char} sat in ${setting}, ${styleTone.adj}. "What exactly is ${topic}?" ${char} ${styleTone.verb}.`,
      imagePrompt: `A ${styleTone.adj} character sitting in ${setting}, looking thoughtful, cartoon style, warm lighting`,
      emoji: sceneEmojis[0],
    },
    {
      title: "The Confusion",
      description: style === "funny"
        ? `Every explanation used bigger words. ${char} felt like reading an alien dictionary. 🤦`
        : `The more ${char} read, the more tangled it got. Every answer led to ten more questions.`,
      narration: style === "funny"
        ? `Every explanation used bigger words. ${char} felt like reading an alien dictionary.`
        : `The more ${char} read, the more tangled it got. Every answer led to ten more questions.`,
      imagePrompt: `A confused character surrounded by floating question marks and tangled lines, cartoon style`,
      emoji: sceneEmojis[1],
    },
    {
      title: "The Breakthrough",
      description: `Then someone said: "${topic}? Think of it as ${analogy}." One sentence changed everything.`,
      narration: `Then someone said: "${topic}? Think of it as ${analogy}." One sentence changed everything.`,
      imagePrompt: `A lightbulb moment, character's eyes lighting up with understanding, bright warm glow, cartoon style`,
      emoji: sceneEmojis[2],
    },
    {
      title: "💡 The Aha Moment",
      description: style === "cinematic"
        ? `Time slowed. The fog lifted. ${char} saw ${topic} with crystal clarity. Everything connected.`
        : style === "funny"
        ? `"THAT'S IT?!" ${char} burst out laughing. "I stressed about THIS for weeks?!" 😂`
        : `💡 And suddenly… it clicked. ${topic} wasn't hard — it was just explained badly before.`,
      narration: style === "cinematic"
        ? `Time slowed. The fog lifted. ${char} saw ${topic} with crystal clarity.`
        : style === "funny"
        ? `That's it?! ${char} burst out laughing. I stressed about this for weeks?!`
        : `And suddenly, it clicked. ${topic} wasn't hard. It was just explained badly before.`,
      imagePrompt: `A magical moment of clarity, sparkles and light surrounding the character, anime style, dramatic lighting`,
      emoji: sceneEmojis[3],
    },
    {
      title: "Understanding",
      description: level === "child"
        ? `${topic} is just like ${analogy} — super simple when you see it right! 🎉`
        : level === "developer"
        ? `At its core, ${topic} maps to a known pattern: ${analogy}. Architecture understood. 🔓`
        : `Once you find the right angle, ${topic} stops being complex — it becomes obvious.`,
      narration: level === "child"
        ? `${topic} is just like ${analogy}. Super simple when you see it the right way!`
        : level === "developer"
        ? `At its core, ${topic} maps to a known pattern: ${analogy}. Architecture understood.`
        : `Once you find the right angle, ${topic} stops being complex. It becomes obvious.`,
      imagePrompt: `A triumphant character with a completed puzzle, celebration, confetti, cartoon style`,
      emoji: sceneEmojis[4],
    },
  ];
}

function buildHindiScenes(topic: string, style: StoryStyle, char: string, analogy: string): StoryScene[] {
  const hChar = pick(["रवि", "प्रिया", "अर्जुन", "नेहा", "काजल"]);
  return [
    {
      title: "सवाल",
      description: `"यार, ${topic} आखिर है क्या?" ${hChar} ने सिर खुजाते हुए पूछा।`,
      narration: `"यार, ${topic} आखिर है क्या?" ${hChar} ने सिर खुजाते हुए पूछा।`,
      imagePrompt: `A curious Indian character thinking deeply, warm colors, cartoon style`,
      emoji: "🤔",
    },
    {
      title: "उलझन",
      description: `जितना पढ़ा, उतना और उलझ गया। हर एक्सप्लेनेशन और मुश्किल लगता था।`,
      narration: `जितना पढ़ा, उतना और उलझ गया। हर एक्सप्लेनेशन और मुश्किल लगता था।`,
      imagePrompt: `A confused character surrounded by books and papers, cartoon style`,
      emoji: "😵",
    },
    {
      title: "समझ",
      description: `फिर किसी ने कहा: "${topic}? ये तो बस ${analogy} जैसा है।"`,
      narration: `फिर किसी ने कहा: "${topic}? ये तो बस ${analogy} जैसा है।"`,
      imagePrompt: `A lightbulb moment, character smiling with understanding, bright warm glow`,
      emoji: "💡",
    },
    {
      title: "💡 अहा!",
      description: style === "funny"
        ? `"बस इतना सा था?! मैं तो PhD कर रहा था इस पर!" ${hChar} हंसा। 😂`
        : `💡 और अचानक… सब समझ आ गया। ${topic} उतना मुश्किल नहीं था।`,
      narration: style === "funny"
        ? `बस इतना सा था?! मैं तो PhD कर रहा था इस पर! ${hChar} हंसा।`
        : `और अचानक, सब समझ आ गया। ${topic} उतना मुश्किल नहीं था।`,
      imagePrompt: `A magical aha moment, sparkles and celebration, anime style`,
      emoji: "✨",
    },
    {
      title: "सीख",
      description: `${topic} उतना मुश्किल नहीं है — बस सही नज़रिए की ज़रूरत थी। 🎉`,
      narration: `${topic} उतना मुश्किल नहीं है। बस सही नज़रिए की ज़रूरत थी।`,
      imagePrompt: `A triumphant character celebrating, confetti, warm colors`,
      emoji: "🎉",
    },
  ];
}

function buildTeluguScenes(topic: string, style: StoryStyle, char: string, analogy: string): StoryScene[] {
  const tChar = pick(["రవి", "ప్రియ", "అర్జున్", "నేహ", "కిరణ్"]);
  return [
    {
      title: "ప్రశ్న",
      description: `"${topic} అంటే ఏమిటి?" ${tChar} తల గోక్కుంటూ అడిగాడు.`,
      narration: `"${topic} అంటే ఏమిటి?" ${tChar} తల గోక్కుంటూ అడిగాడు.`,
      imagePrompt: `A curious character thinking, warm colors, cartoon anime style`,
      emoji: "🤔",
    },
    {
      title: "గందరగోళం",
      description: `ఎంత చదివితే అంత గందరగోళం. ప్రతి వివరణ మరింత కష్టంగా అనిపించింది.`,
      narration: `ఎంత చదివితే అంత గందరగోళం. ప్రతి వివరణ మరింత కష్టంగా అనిపించింది.`,
      imagePrompt: `Confused character surrounded by complex diagrams, cartoon style`,
      emoji: "😵",
    },
    {
      title: "అవగాహన",
      description: `అప్పుడు ఎవరో చెప్పారు: "${topic}? ఇది ${analogy} లాంటిదే."`,
      narration: `అప్పుడు ఎవరో చెప్పారు: "${topic}? ఇది ${analogy} లాంటిదే."`,
      imagePrompt: `Character having a breakthrough moment, light and understanding, cartoon style`,
      emoji: "💡",
    },
    {
      title: "💡 అహా!",
      description: style === "funny"
        ? `"ఇంతేనా?! నేను దీనికోసం చాలా సేపు ఆలోచించాను!" ${tChar} నవ్వాడు. 😂`
        : `💡 అకస్మాత్తుగా… అంతా అర్థమైంది. ${topic} అంత కష్టం కాదు.`,
      narration: style === "funny"
        ? `ఇంతేనా?! నేను దీనికోసం చాలా సేపు ఆలోచించాను! ${tChar} నవ్వాడు.`
        : `అకస్మాత్తుగా, అంతా అర్థమైంది. ${topic} అంత కష్టం కాదు.`,
      imagePrompt: `Magical aha moment with sparkles, anime style, dramatic`,
      emoji: "✨",
    },
    {
      title: "నేర్చుకోవడం",
      description: `${topic} అంత కష్టం కాదు — సరైన దృష్టికోణం కావాలి. 🎉`,
      narration: `${topic} అంత కష్టం కాదు. సరైన దృష్టికోణం కావాలి.`,
      imagePrompt: `Triumphant character with puzzle completed, celebration, confetti`,
      emoji: "🎉",
    },
  ];
}

// --------------- QUIZ GENERATOR ---------------

function generateQuiz(topic: string, analogy: string): { question: string; options: string[]; correct: number } {
  const quizzes = [
    {
      question: `What's a good way to think about ${topic}?`,
      options: [`It's like ${analogy}`, `It's completely random`, `Nobody can understand it`, `It has no real pattern`],
      correct: 0,
    },
    {
      question: `What's the first step to understanding ${topic}?`,
      options: [`Memorize everything`, `Find a simple comparison`, `Give up and move on`, `Read a 500-page book`],
      correct: 1,
    },
    {
      question: `Why do complex topics feel hard at first?`,
      options: [`They're actually impossible`, `We haven't found the right angle yet`, `Only experts can learn them`, `They require special tools`],
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
  return pickN(suggestedTopics.filter(t => t.toLowerCase() !== currentTopic.toLowerCase()), 3);
}

// --------------- REAL-LIFE EXAMPLES ---------------

function generateRealLifeExample(topic: string, type: string): string {
  const t = topic.toLowerCase();
  const pool: Record<string, Record<string, string>> = {
    tech: {
      "ai": "Netflix suggesting your next show — that's AI predicting your taste. 🎬",
      "blockchain": "A shared Google Doc nobody can secretly edit — that's blockchain. 📄",
      "machine learning": "Your spam filter learning which emails to block — that's ML. 📧",
      "algorithm": "A recipe you follow step-by-step to bake a cake — that's an algorithm. 🎂",
    },
    science: {
      "gravity": "Every time you drop your phone — that's gravity doing its thing. 📱",
      "evolution": "From wolves to chihuahuas — that's evolution shaped by humans. 🐕",
      "dna": "DNA is your body's instruction manual — eye color, height, everything. 🧬",
    },
  };

  const p = pool[type] || {};
  for (const key of Object.keys(p)) {
    if (t.includes(key)) return p[key];
  }
  return pick([
    `Your phone uses principles of ${topic} every single day. 📱`,
    `Next time you search online, remember: ${topic} is working behind the scenes. ⚡`,
  ]);
}

// --------------- TITLE GENERATOR ---------------

function generateTitle(topic: string, style: StoryStyle): string {
  const titles: Record<StoryStyle, string[]> = {
    story: [`The Story of ${topic}`, `How ${topic} Finally Made Sense`, `${topic}: A Little Story`],
    funny: [`${topic} (It's Not That Scary)`, `Wait… That's ${topic}?!`, `The ${topic} Moment 😂`],
    cinematic: [`${topic}: The Breakthrough`, `Into ${topic}`, `${topic} — Unveiled`],
    teacher: [`${topic} — Simply Explained`, `Understanding ${topic}`, `${topic}: The Basics`],
  };
  return pick(titles[style]);
}

// --------------- TRANSLATIONS ---------------

const translations: Record<Language, { learnedIt: string; stillConfused: string; nextUp: string }> = {
  en: { learnedIt: "✅ You learned something!", stillConfused: "Still confused? Ask anything…", nextUp: "Try next:" },
  hi: { learnedIt: "✅ आपने कुछ नया सीखा!", stillConfused: "अभी भी confused? कुछ भी पूछो…", nextUp: "अगला:" },
  te: { learnedIt: "✅ మీరు ఏదైనా నేర్చుకున్నారు!", stillConfused: "ఇంకా అర్థం కాలేదా? ఏదైనా అడగండి…", nextUp: "తదుపరి:" },
};

// --------------- MAIN GENERATOR ---------------

export function generateStory(
  topic: string,
  style: StoryStyle,
  level: ExplainLevel = "student",
  lang: Language = "en"
): GeneratedStory {
  const topicType = detectTopicType(topic);
  const analogy = pick(analogies[topicType] || analogies.general);
  const scenes = buildScenes(topic, style, level, lang);
  const story = scenes.map(s => s.description).join("\n\n");

  const summaries = [
    `${topic} is like ${analogy}. Simple when you find the right lens.`,
    `Break ${topic} into small pieces — each one clicks on its own.`,
  ];

  const lessons = [
    `Even the trickiest ideas become clear with the right perspective. 💡`,
    `Understanding ${topic} isn't about being smart — it's about finding the right story. 📖`,
    `Every expert was once confused. Curiosity is the only prerequisite. 🔍`,
  ];

  return {
    title: generateTitle(topic, style),
    story,
    scenes,
    summary: pick(summaries),
    keyLesson: pick(lessons),
    realLifeExample: generateRealLifeExample(topic, topicType),
    quiz: generateQuiz(topic, analogy),
    nextTopics: getNextTopics(topic),
    language: lang,
  };
}

export function generateSimplerVersion(_story: GeneratedStory, topic: string, lang: Language = "en"): GeneratedStory {
  return generateStory(topic, "funny", "child", lang);
}

export { suggestedTopics, translations };
