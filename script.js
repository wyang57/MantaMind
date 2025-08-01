let challengeStarted = false;
let stepIndex = 0;
let currentStreak = 0;
let bestStreak = 0;
let wordIndex = 0;
const challengeSteps = ['definition-match', 'fill-blank', 'choose-sentence'];

const wordData = [
  {
    word: "expeditiously",
    definition: "with speed and efficiency",
    examples: [
      "The team worked expeditiously to meet the tight deadline.",
      "She handled the customer complaint expeditiously and professionally."
    ],
    synonyms: ["swiftly", "promptly"]
  },
  {
    word: "deterrence",
    definition: "the action of discouraging an action or event through instilling doubt or fear of the consequences",
    examples: [
      "The presence of security cameras acts as a deterrence to theft.",
      "Nuclear deterrence has shaped global military strategy for decades."
    ],
    synonyms: ["discouragement", "prevention"]
  },
  {
    word: "providence",
    definition: "the protective care of God or nature as a spiritual power",
    examples: [
      "They saw their survival as a sign of divine providence.",
      "Through providence, the storm passed without causing harm."
    ],
    synonyms: ["fate", "divine guidance"]
  },
  {
    word: "tricep theory",
    definition: "a humorous or informal concept suggesting that tricep size correlates with dominance or credibility",
    examples: [
      "According to tricep theory, the bigger the arms, the stronger the argument.",
      "He jokingly invoked tricep theory to justify skipping leg day."
    ],
    synonyms: ["gym lore", "bro science"]
  },
  {
    word: "altruism",
    definition: "the selfless concern for the well-being of others",
    examples: [
      "Her altruism was evident in her volunteer work at the shelter.",
      "True altruism expects nothing in return."
    ],
    synonyms: ["selflessness", "compassion"]
  },
  {
    word: "totalitarianism",
    definition: "a system of government that is centralized and dictatorial and requires complete subservience to the state",
    examples: [
      "The novel explores life under a totalitarianism regime.",
      "Totalitarianism suppresses individual freedoms and dissent."
    ],
    synonyms: ["authoritarianism", "dictatorship"]
  },
  {
    word: "negligible",
    definition: "so small or unimportant as to be not worth considering",
    examples: [
      "The cost difference between the two models is negligible.",
      "The error was negligible and didn’t affect the results."
    ],
    synonyms: ["trivial", "insignificant"]
  },
  {
    word: "ameliorate",
    definition: "to make something better or more tolerable",
    examples: [
      "The new policy aims to ameliorate working conditions.",
      "She took steps to ameliorate the tension in the room."
    ],
    synonyms: ["improve", "enhance"]
  },
  {
    word: "sedation",
    definition: "the administering of a sedative drug to produce a state of calm or sleep",
    examples: [
      "The patient was under sedation during the procedure.",
      "Sedation helped ease her anxiety before surgery."
    ],
    synonyms: ["calming", "tranquilization"]
  },
  {
    word: "regurgitate",
    definition: "to bring food or information back up, often without processing",
    examples: [
      "The bird regurgitates food to feed its chicks.",
      "He regurgitated facts without understanding them."
    ],
    synonyms: ["vomit", "repeat"]
  },
  {
    word: "precedence",
    definition: "the condition of being considered more important than something else",
    examples: [
      "Safety takes precedence over speed.",
      "In royal ceremonies, precedence is strictly observed."
    ],
    synonyms: ["priority", "importance"]
  },
  {
    word: "consolation",
    definition: "comfort received after a loss or disappointment",
    examples: [
      "Her kind words were a small consolation.",
      "The team found consolation in their strong performance."
    ],
    synonyms: ["comfort", "solace"]
  },
  {
    word: "usurp",
    definition: "to take a position of power or importance illegally or by force",
    examples: [
      "He attempted to usurp the throne.",
      "The new manager usurped control without proper authority."
    ],
    synonyms: ["seize", "overthrow"]
  },
  {
    word: "omitted",
    definition: "left out or excluded, either intentionally or by oversight",
    examples: [
      "Several key details were omitted from the report.",
      "She omitted to mention her previous experience."
    ],
    synonyms: ["excluded", "neglected"]
  }
];


// ⏱️ Sync challenge state from localStorage on page load
function syncChallengeStatus() {
  challengeStarted = localStorage.getItem('challengeStarted') === 'true';
  console.log("Challenge started state:", challengeStarted);
  updateButtons();
}


// 🔘 Update button visibility
function updateButtons() {
  const startBtn = document.getElementById('start-btn');
  const continueBtn = document.getElementById('continue-btn');
  const giveUpBtn = document.getElementById('give-up-btn');

  if (challengeStarted) {
    startBtn.style.display = 'none';
    continueBtn.style.display = 'inline-block';
    giveUpBtn.style.display = 'inline-block';
  } else {
    startBtn.style.display = 'inline-block';
    continueBtn.style.display = 'none';
    giveUpBtn.style.display = 'none';
  }
}

// 🧩 Load vocabulary task by type
function loadTask(type) {
  const container = document.getElementById('task-container');
  container.innerHTML = '';
  const currentWord = wordData[wordIndex];
  const synonymHint = currentWord.synonyms[Math.floor(Math.random() * currentWord.synonyms.length)];

  if (type === 'definition-match') {
    container.innerHTML = `
      <p>What does "<strong>${currentWord.word}</strong>" mean?</p>
      <button class="choice-btn" data-text="${currentWord.definition}" onclick="handleAnswer(true, this)">${currentWord.definition}</button>
      <button class="choice-btn" data-text="Something unrelated" onclick="handleAnswer(false, this)">Something unrelated</button>
    `;
  } else if (type === 'fill-blank') {
    const [before, after] = currentWord.examples[0].split(currentWord.word);
    container.innerHTML = `
      <p>Complete the sentence:</p>
      <p>${before}<input type="text" id="blank-input" />${after}</p>
      <p><em>Hint: A synonym is "<strong>${synonymHint}</strong>"</em></p>
      <button onclick="checkFillBlank()">Submit</button>
    `;
  } else if (type === 'choose-sentence') {
    container.innerHTML = `
      <p>Which sentence uses "${currentWord.word}" correctly?</p>
      <button class="choice-btn" data-text="${currentWord.examples[0]}" onclick="handleAnswer(true, this)">${currentWord.examples[0]}</button>
      <button class="choice-btn" data-text="The sky was very ${currentWord.word} today." onclick="handleAnswer(false, this)">The sky was very ${currentWord.word} today.</button>
    `;
  }
}

// ✅ Handle answer selection
function handleAnswer(isCorrect, button) {
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.innerHTML = btn.dataset.text;
  });

  const emoji = isCorrect ? "✅" : "❌";
  button.innerHTML = `${button.dataset.text} ${emoji}`;
  showFeedback(isCorrect);

  if (isCorrect) {
    currentStreak++;
    bestStreak = Math.max(bestStreak, currentStreak);
    document.getElementById('current-streak').textContent = currentStreak;
    document.getElementById('best-streak').textContent = bestStreak;

    document.getElementById('next-task').style.display = 'inline-block';
    stepIndex++;
  } else {
    currentStreak = 0;
    document.getElementById('current-streak').textContent = currentStreak;
  }
}

// ✍️ Fill-in-the-blank submission
function checkFillBlank() {
  const input = document.getElementById('blank-input').value.trim().toLowerCase();
  const currentWord = wordData[wordIndex];
  const isCorrect = input === currentWord.word.toLowerCase();
  showFeedback(isCorrect);

  if (isCorrect) {
    currentStreak++;
    bestStreak = Math.max(bestStreak, currentStreak);
    document.getElementById('current-streak').textContent = currentStreak;
    document.getElementById('best-streak').textContent = bestStreak;

    document.getElementById('next-task').style.display = 'inline-block';
    stepIndex++;
  } else {
    currentStreak = 0;
    document.getElementById('current-streak').textContent = currentStreak;
  }
}

// 🎉 Show feedback
function showFeedback(isCorrect) {
  const feedback = document.getElementById('feedback');
  feedback.textContent = isCorrect ? "🎉 Correct!" : "❌ Try again!";
  feedback.style.opacity = 1;
  setTimeout(() => {
    feedback.style.opacity = 0;
  }, 2000);
}

// 🔀 Shuffle vocabulary entries
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffleArray(wordData);

// ▶️ Start Challenge
document.getElementById('start-btn').addEventListener('click', () => {
  challengeStarted = true;
  localStorage.setItem('challengeStarted', 'true');
  updateButtons();
  startChallenge();
});

// ➡️ Advance to next task
const nextBtn = document.getElementById('next-task');
nextBtn.textContent = "Continue Challenge";
nextBtn.disabled = false;
nextBtn.addEventListener('click', () => {
  if (stepIndex < challengeSteps.length) {
    loadTask(challengeSteps[stepIndex]);
    nextBtn.style.display = 'none';
  } else {
    wordIndex = (wordIndex + 1) % wordData.length;
    stepIndex = 0;
    loadTask(challengeSteps[stepIndex]);
  }
});

// 😅 Give Up logic
document.getElementById('give-up-btn').addEventListener('click', () => {
  const currentWord = wordData[wordIndex];
  const container = document.getElementById('task-container');

  container.innerHTML += `
    <div class="reveal-box">
      <p><strong>Answer:</strong> ${currentWord.word}</p>
      <p><strong>Definition:</strong> ${currentWord.definition}</p>
    </div>
  `;
  currentStreak = 0;
  document.getElementById('current-streak').textContent = currentStreak;
  nextBtn.style.display = 'inline-block';
});

// 📦 DOM Ready
window.addEventListener('DOMContentLoaded', syncChallengeStatus);
