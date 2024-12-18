const form = document.getElementById("greetingForm");
const nameInput = document.getElementById("name");
const asciiOutput = document.getElementById("asciiOutput");
const outputBox = document.getElementById("outputBox");
const downloadBtn = document.getElementById("downloadBtn");
const canvas = document.getElementById("asciiCanvas");
const progressBarContainer = document.querySelector(".progress-bar-container");
const progressBar = document.getElementById("loadingProgressBar");

const TERMINAL_USERNAME = `merry@christmas:~$ npx christmas`;

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.querySelector('p').textContent = message;
  notification.classList.add('is-active');
  setTimeout(() => {
      notification.classList.remove('is-active');
  }, 3000);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();

  if (!validateName(name)) {
    showNotification("Please enter a valid name up to 36 characters.");
    return;
  }

  progressBarContainer.style.display = "block";
  progressBar.value = 0;
  progressPercentage.textContent = "0%";
  outputBox.style.display = "none";

  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    progressBar.value = progress;
    progressPercentage.textContent = `Generating: ${progress}%`;

    if (progress >= 105) {
      clearInterval(interval);
      try {
        const asciiTree = generateAsciiTree(sanitizeInput(name));
        asciiOutput.textContent = `\n\n${TERMINAL_USERNAME} '${sanitizeInput(name)}' \n${asciiTree}`;
        asciiOutput.style.textAlign = "left";
        outputBox.style.display = "block";
        createAsciiImage(asciiTree, sanitizeInput(name));
      } catch (error) {
        showNotification("An unexpected error occurred while generating the greeting.");
        console.error(error);
      } finally {
        progressBarContainer.style.display = "none";
        nameInput.value = '';
      }
    }
  }, 350);
});

function validateName(name) {
  const maxLength = 36;
  return name.length > 1 && name.length <= maxLength;
}

function sanitizeInput(input) {
  const element = document.createElement("div");
  element.innerText = input;
  return element.innerText;
}

function generateAsciiTree(name) {
  return `

🎅 Greeting Wishes From 🎅

         🌟
        /__\\
       /____\\
      /______\\
     /________\\
    /__________\\
   /____________\\
  /______________\\
 /________________\\
      |||||||

🎄 ${name} 🎄

  `;
}

function createAsciiImage(asciiTree, name) {
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 720;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, "#2c001e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = "#fdcb6e";
  ctx.font = "bold 20px 'Geist Mono', serif";
  ctx.textAlign = "left";

  const USER = `${TERMINAL_USERNAME} '${sanitizeInput(name)}'`;
  ctx.fillText(USER, 20, 50);

  const lines = asciiTree.split("\n");
  const lineHeight = 35;
  const startX = 20;
  const startY = 80;

  lines.forEach((line, index) => {
    ctx.fillText(line, startX, startY + index * lineHeight);
  });
}

downloadBtn.addEventListener("click", () => {
  try {
    const link = document.createElement("a");
    const timestamp = new Date().getTime();
    link.download = `christmas-greeting-${timestamp}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    showNotification("An error occurred while downloading the image.");
    console.error(error);
  }
});

document.head.appendChild(canonicalLink);
const toggle = document.getElementById('darkModeToggle');
const body = document.body;

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        toggle.checked = true;
    } else {
        body.classList.remove('dark-mode');
        toggle.checked = false;
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
}

toggle.addEventListener('change', () => {
    const newTheme = toggle.checked ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const newSystemTheme = e.matches ? 'dark' : 'light';
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        applyTheme(newSystemTheme);
    }
});
initTheme();
