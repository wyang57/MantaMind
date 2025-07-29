

const challengeSteps = ['definition-match', 'fill-blank', 'choose-sentence'];
let stepIndex = 0;
let currentStreak = 0;
let bestStreak = 0;


const wordData = {
  word: "ubiquitous",
  definition: "present, appearing, or found everywhere",
  examples: [
    "Smartphones have become ubiquitous in modern society.",
    "She noticed the ubiquitous presence of ads."
  ],
  synonyms: ["omnipresent", "universal"]
};

const nextBtn = document.getElementById('next-task');
nextBtn.textContent = "Continue Challenge";
nextBtn.disabled = false;

nextBtn.addEventListener('click', () => {
  if (stepIndex < challengeSteps.length) {
    loadTask(challengeSteps[stepIndex]);
    nextBtn.style.display = 'none'; // hide until correct answer
  } else {
    document.getElementById('task-container').innerHTML = "<p>🎉 Challenge complete!</p>";
    nextBtn.textContent = "Retry Challenge";
    challengeStarted = false;
    stepIndex = 0;
  }
  
});



function loadTask(type) {
  const container = document.getElementById('task-container');
  container.innerHTML = '';
  

  if (type === 'definition-match') {
    container.innerHTML = `
      <p>What does "<strong>${wordData.word}</strong>" mean?</p>
      <button class="choice-btn" data-text="${wordData.definition}" onclick="handleAnswer(true, this)">${wordData.definition}</button>
      <button class="choice-btn" data-text="Something unrelated" onclick="handleAnswer(false, this)">Something unrelated</button>
    `;
  } else if (type === 'fill-blank') {
    container.innerHTML = `
      <p>Complete the sentence:</p>
      <p>Smartphones have become <input type="text" id="blank-input" /> in modern society.</p>
      <button onclick="checkFillBlank()">Submit</button>
    `;
  } else if (type === 'choose-sentence') {
    container.innerHTML = `
      <p>Which sentence uses "${wordData.word}" correctly?</p>
      <button class="choice-btn" data-text="${wordData.examples[0]}" onclick="handleAnswer(true, this)">${wordData.examples[0]}</button>
      <button class="choice-btn" data-text="The sky was very ubiquitous today." onclick="handleAnswer(false, this)">The sky was very ubiquitous today.</button>
    `;
  }
}

function handleAnswer(isCorrect, button) {
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.innerHTML = btn.dataset.text;
  });

  const emoji = isCorrect ? "✅" : "❌";
  button.innerHTML = `${button.dataset.text} ${emoji}`;
  showFeedback(isCorrect);

  if (isCorrect) {
  currentStreak++;
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  document.getElementById('current-streak').textContent = currentStreak;
  document.getElementById('best-streak').textContent = bestStreak;

  nextBtn.style.display = 'inline-block';
  stepIndex++;
} else {
  currentStreak = 0;
  document.getElementById('current-streak').textContent = currentStreak;
}


}

function checkFillBlank() {
  const input = document.getElementById('blank-input').value.trim().toLowerCase();
  const isCorrect = input === wordData.word;
  showFeedback(isCorrect);
  if (isCorrect) {
  currentStreak++;
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  document.getElementById('current-streak').textContent = currentStreak;
  document.getElementById('best-streak').textContent = bestStreak;

  nextBtn.style.display = 'inline-block';
  stepIndex++;
} else {
  currentStreak = 0;
  document.getElementById('current-streak').textContent = currentStreak;
}


}

function showFeedback(isCorrect) {
  const feedback = document.getElementById('feedback');
  feedback.textContent = isCorrect ? "🎉 Correct!" : "❌ Try again!";
  feedback.style.opacity = 1;
  setTimeout(() => {
    feedback.style.opacity = 0;
  }, 2000);
}
