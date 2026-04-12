import { useState, useEffect } from "react";

export function useTypewriter(text: string, baseSpeed = 14) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;

    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        return;
      }
      // Natural speed variation
      const char = text[i - 1];
      let delay = baseSpeed;
      if (char === '.' || char === '!' || char === '?') delay = baseSpeed * 6;
      else if (char === ',' || char === ';' || char === ':') delay = baseSpeed * 3;
      else if (char === '\n') delay = baseSpeed * 4;
      else if (char === ' ') delay = baseSpeed * 0.5;
      else delay = baseSpeed + (Math.random() - 0.5) * baseSpeed * 0.6;

      timeout = setTimeout(tick, delay);
    };

    timeout = setTimeout(tick, baseSpeed);
    return () => clearTimeout(timeout);
  }, [text, baseSpeed]);

  return { displayed, done };
}
