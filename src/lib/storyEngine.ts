const characters = [
  "a curious kid named Leo",
  "a smart robot called Spark",
  "a confused student named Maya",
  "a magical wizard named Orion",
  "a young explorer called Nova",
];

const settings = [
  "in a small village by the mountains",
  "in outer space on a tiny spaceship",
  "inside a colorful school",
  "in a magical world full of wonders",
  "inside a giant computer system",
];

const goals = [
  "trying to understand",
  "on a mission to learn about",
  "super curious about",
  "exploring the idea of",
  "determined to figure out",
];

const obstacles = [
  "but it felt confusing at first 😵‍💫",
  "and nothing made sense at all 🤯",
  "but it was incredibly complicated 😰",
  "and everyone explained it in a really hard way 😤",
  "but all the books were full of big, scary words 📚",
];

const analogies = [
  "like a puzzle where each piece clicks into place 🧩",
  "like building blocks stacking one on top of another 🧱",
  "like a fun game where you level up step by step 🎮",
  "like a recipe — you just follow the steps 🍳",
  "like a storybook that unfolds page by page 📖",
];

const adventureWords = [
  "quest", "discover", "journey", "brave", "explore", "adventure", "mission",
];

const funnyPhrases = [
  "which was funnier than a cat wearing a top hat 🎩🐱",
  "and honestly, even the smart robot was confused 🤖😂",
  "like trying to teach a fish to ride a bicycle 🐟🚲",
  "which made everyone laugh so hard they cried 😂",
];

const emotionalPhrases = [
  "and it felt like the whole world suddenly made sense 🌍✨",
  "with tears of joy because learning felt so powerful 🥹",
  "and a warm feeling spread through their heart ❤️",
  "realizing that struggling was part of the beautiful journey 🌱",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickUnique<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export type StoryStyle = "adventure" | "funny" | "emotional";

export interface GeneratedStory {
  title: string;
  story: string;
  summary: string;
  keyLesson: string;
}

export function generateStory(topic: string, style: StoryStyle): GeneratedStory {
  const character = pick(characters);
  const setting = pick(settings);
  const goal = pick(goals);
  const obstacle = pick(obstacles);
  const analogy = pick(analogies);

  const sentences: string[] = [];

  // INTRO
  sentences.push(`Once upon a time, ${character} was ${setting} and was ${goal} ${topic}. ✨`);

  // PROBLEM
  sentences.push(`They asked everyone around, ${obstacle}.`);
  sentences.push(`"Why is ${topic} so hard to understand?" they wondered. 🤔`);

  // SIMPLIFICATION
  sentences.push(`Then one day, a wise teacher appeared and said: "Think of ${topic} ${analogy}."`);
  sentences.push(`Suddenly, everything started to click!`);

  // STYLE ADAPTATION
  if (style === "adventure") {
    const words = pickUnique(adventureWords, 3);
    sentences.push(`So they went on a ${words[0]} to ${words[1]} every part of ${topic}. 🗺️`);
    sentences.push(`Each step of the ${words[2]} revealed something new and exciting!`);
    sentences.push(`They faced challenges along the way, but their curiosity was unstoppable. 💪`);
  } else if (style === "funny") {
    sentences.push(`The explanation was so simple, ${pick(funnyPhrases)}.`);
    sentences.push(`They tried explaining it to a friend, ${pick(funnyPhrases)}.`);
    sentences.push(`But hey, at least now they actually understood ${topic}! 🎉`);
  } else {
    sentences.push(`Learning about ${topic} wasn't easy, ${pick(emotionalPhrases)}.`);
    sentences.push(`Every small step forward felt like a victory, ${pick(emotionalPhrases)}.`);
    sentences.push(`The struggle made the understanding even more beautiful. 🌟`);
  }

  // RESOLUTION
  sentences.push(`In the end, ${character.split(" ")[0]} understood ${topic} completely.`);
  sentences.push(`And from that day on, they could explain it to anyone — even a five-year-old! 🧒`);
  sentences.push(`The end. 🌈`);

  const title = `The Story of ${topic}`;
  const story = sentences.join(" ");

  const summaries = [
    `${topic} is simply ${analogy.replace(/like /i, "")}. Once you see it that way, it becomes easy to understand.`,
    `The key is to break ${topic} down into small, simple pieces — just like the story showed us.`,
  ];

  const lessons = [
    `Even the most complex ideas become simple when you find the right way to look at them. 💡`,
    `Understanding ${topic} is not about being smart — it's about finding the right story. 📖`,
    `Every expert was once a beginner. The secret is to never stop being curious. 🔍`,
  ];

  return {
    title,
    story,
    summary: summaries.join(" "),
    keyLesson: pick(lessons),
  };
}
