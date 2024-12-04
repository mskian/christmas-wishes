const form = document.getElementById("greetingForm");
const nameInput = document.getElementById("name");
const asciiOutput = document.getElementById("asciiOutput");
const outputBox = document.getElementById("outputBox");
const downloadBtn = document.getElementById("downloadBtn");
const canvas = document.getElementById("asciiCanvas");
const loadingSpinner = document.getElementById("loadingSpinner");

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
    showNotification("Please enter a valid name up to 36 characters).");
    return;
  }

  loadingSpinner.style.display = "block";
  outputBox.style.display = "none";


  setTimeout(() => {
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
      loadingSpinner.style.display = "none";
    }
  }, 1500);
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
  ctx.font = "20px 'Ubuntu Mono', serif";
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
    link.download = "christmas_greeting.png";
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    showNotification("An error occurred while downloading the image.");
    console.error(error);
  }
});
