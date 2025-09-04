let challengeStarted = false;
let stepIndex = 0;
let currentStreak = 0;
let bestStreak = 0;
let wordIndex = 0;
const challengeSteps = ['definition-match', 'fill-blank', 'choose-sentence'];
const feedback = document.getElementById('feedback');



//##############################################################

let wordData = [];

// Load wordData from data.json
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    wordData = data;
    shuffleArray(wordData);
    // If challenge already started, reload the current task
    if (challengeStarted) {
      loadTask(challengeSteps[stepIndex]);
    }
  })
  .catch(error => {
    console.error('Failed to load vocabulary data:', error);
  });

//##############################################################
function startChallenge() {
  stepIndex = 0;
  wordIndex = 0;
  loadTask(challengeSteps[stepIndex]);
  document.getElementById('next-task').style.display = 'none';
}


// ⏱️ Sync challenge state from localStorage on page load
function syncChallengeStatus() {
  challengeStarted = localStorage.getItem('challengeStarted') === 'true';
  console.log("Challenge started state:", challengeStarted);
  updateButtons();
}


const nextBtn = document.getElementById('next-task');
const giveUpBtn = document.getElementById('give-up-btn');

function updateButtons() {
  if (challengeStarted) {
    nextBtn.textContent = "Continue Challenge";
    giveUpBtn.style.display = 'inline-block';
  } else {
    nextBtn.textContent = "Start Challenge";
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

function showFeedback(isCorrect) {
  const feedback = document.getElementById('feedback');
  feedback.textContent = isCorrect ? "🎉 Correct!" : "❌ Try again!";
  feedback.classList.add('show');
  feedback.classList.add(isCorrect ? 'correct' : 'incorrect');

  setTimeout(() => {
    feedback.classList.remove('show');
    feedback.classList.remove('correct');
    feedback.classList.remove('incorrect');
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

nextBtn.addEventListener('click', () => {
  if (!challengeStarted) {
    challengeStarted = true;
    localStorage.setItem('challengeStarted', 'true');
    updateButtons();
    startChallenge();
  } else {
    if (stepIndex < challengeSteps.length) {
      loadTask(challengeSteps[stepIndex]);
      nextBtn.style.display = 'none';
    } else {
      wordIndex = (wordIndex + 1) % wordData.length;
      stepIndex = 0;
      loadTask(challengeSteps[stepIndex]);
    }
  }
});


// ➡️ Advance to next task
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
