document.addEventListener('DOMContentLoaded', () => {
    const nameForm = document.getElementById('nameForm');
    const nameInput = document.getElementById('name');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = progressContainer.querySelector('progress');
    const output = document.getElementById('output');
    const greetingImage = document.getElementById('greetingImage');
    const generatedImage = document.getElementById('generatedImage');
    const downloadImage = document.getElementById('downloadImage');
    const backgroundImagePath = './images/christmas-wishes.png';
  
    const sanitizeInput = (input) => {
      const tempDiv = document.createElement('div');
      tempDiv.textContent = input.trim();
      return tempDiv.innerHTML;
    };
  
    const validateInput = (name) => {
      if (!name || name.length < 2 || name.length > 36) {
        throw new Error('Name must be between 2 and 36 characters.');
      }
    };
  
    const generateGreetingImage = (name) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = backgroundImagePath;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          // ctx.fillStyle = '#d35585'; // Dark pink
          ctx.font = 'bold 36px "Catamaran", sans-serif';
          ctx.textAlign = 'center';
          // ctx.fillText('🎄 Merry Christmas 🎄', canvas.width / 2, 90);
  
          ctx.fillStyle = '#130f40'; // Brown
          ctx.font = 'bold 30px "Catamaran", sans-serif';
          ctx.fillText(`${name}`, canvas.width / 2, canvas.height - 60);
  
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject(new Error('Failed to load the background image.'));
      });
    };
  
    const terminalProcess = async (steps) => {
      for (const step of steps) {
        output.innerHTML += `<p class="has-text-danger" style="font-family: 'Catamaran', sans-serif;">${step}</p>`;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };
  
    const showProgress = async () => {
      progressContainer.classList.remove('is-hidden');
      for (let i = 0; i <= 100; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        progressBar.value = i;
      }
      progressContainer.classList.add('is-hidden');
    };
  
    nameForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const name = sanitizeInput(nameInput.value);
  
      try {
        output.innerHTML = '';
        greetingImage.classList.add('is-hidden');
  
        validateInput(name);
  
        await terminalProcess([
          'ℹ️ Validating input ...',
          '✅ Input validation successful',
          '🥤 Loading resources ...',
          'ℹ️ Preparing your greeting ...',
        ]);

        nameInput.value = '';
  
        await showProgress();
  
        const imageSrc = await generateGreetingImage(name);
  
        generatedImage.src = imageSrc;
        downloadImage.href = imageSrc;
        const timestamp = new Date().getTime();
        downloadImage.download = `christmas-greeting-${timestamp}.png`;
        greetingImage.classList.remove('is-hidden');
  
        output.innerHTML += `<p class="has-text-danger" style="font-family: 'Catamaran', sans-serif;">🎉 Greeting generated successfully</p>`;
      } catch (err) {
        output.innerHTML += `<p class="has-text-danger" style="font-family: 'Catamaran', sans-serif;">🔴 ${err.message}</p>`;
      }
    });
  });
  