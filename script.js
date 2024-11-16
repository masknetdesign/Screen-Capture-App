startCaptureButton.addEventListener('click', async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      alert('Captura de tela não é suportada neste dispositivo ou navegador.');
      return;
    }
  
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      screenVideo.srcObject = stream;
  
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
      mediaRecorder.start();
  
      startCaptureButton.disabled = true;
      stopCaptureButton.disabled = false;
      downloadButton.disabled = true;
    } catch (error) {
      console.error('Erro ao capturar a tela:', error);
      alert('Erro ao capturar a tela. Permissões negadas ou dispositivo não suportado.');
    }
  });
  