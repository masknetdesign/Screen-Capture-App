// Referências aos elementos do DOM
const startCaptureButton = document.getElementById('startCapture');
const stopCaptureButton = document.getElementById('stopCapture');
const downloadButton = document.getElementById('download');
const screenVideo = document.getElementById('screenVideo');

let mediaRecorder;
let recordedChunks = [];

// Iniciar captura de tela
startCaptureButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    screenVideo.srcObject = stream;

    // Inicializa o gravador de mídia
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
    mediaRecorder.start();

    // Atualiza os botões
    startCaptureButton.disabled = true;
    stopCaptureButton.disabled = false;
    downloadButton.disabled = true;
  } catch (error) {
    alert('Erro ao capturar a tela. Verifique as permissões.');
    console.error('Erro:', error);
  }
});

// Parar captura de tela
stopCaptureButton.addEventListener('click', () => {
  mediaRecorder.stop();
  screenVideo.srcObject.getTracks().forEach((track) => track.stop());

  startCaptureButton.disabled = false;
  stopCaptureButton.disabled = true;
  downloadButton.disabled = false;
});

// Baixar vídeo gravado
downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'gravacao_tela.webm';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
});
