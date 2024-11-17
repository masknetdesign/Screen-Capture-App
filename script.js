// Captura apenas a webcam do usuário
async function startRecording() {
    try {
      // Solicita permissão para capturar vídeo e áudio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
  
      // Exibe o stream no vídeo
      videoElement.srcObject = stream;
  
      // Cria o MediaRecorder para gravar o stream
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });
  
      // Evento para armazenar os chunks de vídeo gravados
      mediaRecorder.ondataavailable = function(event) {
        recordedChunks.push(event.data);
      };
  
      // Quando a gravação terminar, cria um link de download para o vídeo
      mediaRecorder.onstop = function() {
        const blob = new Blob(recordedChunks, {
          type: 'video/webm'
        });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.style.display = 'inline-block';
        recordedChunks = []; // Limpa os chunks gravados
      };
  
      // Inicia a gravação
      mediaRecorder.start();
      startBtn.disabled = true;
      stopBtn.disabled = false;
      console.log('Gravação iniciada');
    } catch (error) {
      console.error('Erro ao iniciar a gravação: ', error);
      alert('Falha ao capturar a webcam ou permissão negada.');
    }
  }
  