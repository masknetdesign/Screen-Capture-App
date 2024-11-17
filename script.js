// script.js

let mediaRecorder;
let recordedChunks = [];
let stream;

// Selecionando os elementos da página
const videoElement = document.getElementById('videoElement');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadLink = document.getElementById('downloadLink');

// Função para iniciar a gravação
async function startRecording() {
  try {
    // Solicita permissão para capturar a tela com áudio, com uma qualidade de resolução maior
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920 }, // Tamanho ideal de largura
        height: { ideal: 1080 }, // Tamanho ideal de altura
        frameRate: { ideal: 30 } // Taxa de quadros ideal
      },
      audio: true  // Permite capturar o áudio
    });

    // Tenta capturar o áudio do microfone
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    // Mescla o áudio do microfone com o stream de captura da tela
    const mixedStream = new MediaStream([
      ...displayStream.getVideoTracks(),
      ...audioStream.getAudioTracks()
    ]);

    // Exibe a captura da tela na tag <video>
    videoElement.srcObject = mixedStream;

    // Cria o MediaRecorder para gravar o stream
    mediaRecorder = new MediaRecorder(mixedStream, {
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
    alert('Falha ao capturar a tela ou permissão negada.');
  }
}

// Função para parar a gravação
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }

  // Parando todos os tracks
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  startBtn.disabled = false;
  stopBtn.disabled = true;
  console.log('Gravação parada');
}

// Adiciona event listeners aos botões
startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
