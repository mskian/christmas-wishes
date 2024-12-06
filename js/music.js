function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.querySelector('p').textContent = message;
    notification.classList.add('is-active');
    setTimeout(() => {
          notification.classList.remove('is-active');
    }, 3000);
}

async function loadTracks() {
  try {
    const response = await fetch('api/music-tracks.json');
    if (!response.ok) throw new Error('Failed to load music tracks');
    
    const tracks = await response.json();
    if (!Array.isArray(tracks) || tracks.length === 0) {
      throw new Error('No tracks found in the JSON file');
    }

    const fragment = document.createDocumentFragment();
    tracks.forEach((track, index) => {
      const option = document.createElement('option');
      option.value = track.url;
      option.textContent = track.name;
      if (index === 0) option.selected = true;
      fragment.appendChild(option);
    });

    audioSelector.appendChild(fragment);

    audio.src = tracks[0].url;
    downloadButton.href = tracks[0].url;
  } catch (error) {
    console.error('Error loading tracks:', error);
    showNotification('Failed to load tracks. Please refresh.');
  }
}

    const audio = document.getElementById('audio');
    const playPauseButton = document.getElementById('playPauseButton');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('currentTime');
    const audioSelector = document.getElementById('audioSelector');
    const downloadButton = document.getElementById('downloadButton');

    document.addEventListener('DOMContentLoaded', loadTracks);

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${minutes}:${secs}`;
    }

    playPauseButton.addEventListener('click', () => {
      if (!audio.src) {
        showNotification('Please select a track!');
        return;
      }
      if (audio.paused) {
        audio.play();
        playPauseButton.textContent = '⏸ Pause';
      } else {
        audio.pause();
        playPauseButton.textContent = '▶️ Play';
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const currentTimeFormatted = formatTime(audio.currentTime);
      currentTime.textContent = currentTimeFormatted;

      const progressWidth = (audio.currentTime / audio.duration) * 100;
      progress.style.width = `${progressWidth}%`;
    });

    progressBar.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const clickX = e.offsetX;
      const width = progressBar.offsetWidth;
      const newTime = (clickX / width) * audio.duration;
      audio.currentTime = newTime;
    });

    audioSelector.addEventListener('change', (e) => {
      const selectedTrack = e.target.value;
      audio.src = selectedTrack;
      audio.pause();
      audio.currentTime = 0;
      progress.style.width = '0%';
      currentTime.textContent = '0:00';
      playPauseButton.textContent = '▶️ Play';
      downloadButton.href = selectedTrack;
      audio.play();
      playPauseButton.textContent = '⏸ Pause';
    });

    audio.addEventListener('ended', () => {
      const currentIndex = audioSelector.selectedIndex;
      const nextIndex = (currentIndex + 1) % audioSelector.options.length;
      audioSelector.selectedIndex = nextIndex;
      const nextTrack = audioSelector.value;
      audio.src = nextTrack;
      audio.play();
      playPauseButton.textContent = '⏸ Pause';
      downloadButton.href = nextTrack;
    });

    audio.addEventListener('error', () => {
       showNotification('Error loading audio. Please check the track and try again.');
    });

    downloadButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const audioUrl = downloadButton.href;
     try {
        const response = await fetch(audioUrl);
        if (!response.ok) throw new Error('Failed to fetch audio file');
            const audioBlob = await response.blob();
            const audioUrlObject = URL.createObjectURL(audioBlob);
            const tempLink = document.createElement('a');
            tempLink.href = audioUrlObject;
            tempLink.download = audioUrl.split('/').pop();
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            URL.revokeObjectURL(audioUrlObject);
        } catch (error) {
           showNotification('Error downloading audio');
           console.error('Error downloading audio:', error);
        }
    });
