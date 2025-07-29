const challengeSteps = ['definition-match', 'fill-blank', 'choose-sentence'];
let stepIndex = 0;

const wordData = {
  word: "ubiquitous",
  definition: "present, appearing, or found everywhere",
  examples: [
    "Smartphones have become ubiquitous in modern society.",
    "She noticed the ubiquitous presence of ads."
  ],
  synonyms: ["omnipresent", "universal"]
};

document.getElementById('next-task').addEventListener('click', () => {
  if (stepIndex < challengeSteps.length) {
    loadTask(challengeSteps[stepIndex++]);
  } else {
    document.getElementById('task-container').innerHTML = "<p>🎉 Challenge complete!</p>";
    stepIndex = 0;
    document.getElementById('next-task').textContent = "Retry Challenge";
  }
});

function loadTask(type) {
  const container = document.getElementById('task-container');
  container.innerHTML = '';

  if (type === 'definition-match') {
    container.innerHTML = `
      <p>What does "<strong>${wordData.word}</strong>" mean?</p>
      <button onclick="checkAnswer(true)">✅ ${wordData.definition}</button>
      <button onclick="checkAnswer(false)">❌ Something unrelated</button>
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
      <button onclick="checkAnswer(true)">✔️ ${wordData.examples[0]}</button>
      <button onclick="checkAnswer(false)">❌ The sky was very ubiquitous today.</button>
    `;
  }
}

function checkAnswer(correct) {
  alert(correct ? "✅ Correct!" : "❌ Try again!");
}

function checkFillBlank() {
  const input = document.getElementById('blank-input').value.trim().toLowerCase();
  if (input === wordData.word) {
    alert("✅ Nicely done!");
  } else {
    alert("❌ That's not quite right.");
  }
}
