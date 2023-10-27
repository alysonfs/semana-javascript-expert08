import MP4Demuxer from "./mp4-demuxer.js"
import VideoProcessor from "./video-processor.js"

const qvgaConstraints = {
  width: 320,
  height: 240,
}

const vgaConstraints = {
  width: 640,
  height: 480,
}

const hdConstraints = {
  width: 1280,
  height: 720,
}

const encoderConfig = {
  ...qvgaConstraints,
  bitrate: 10e6,
  // WEBM
  codec: 'vp09.00.10.08',
  pt: 4,
  hardwareAcceleration: 'prefer-software',

  // MP4
  // codec: 'avc1.42002A',
  // pt:1, 
  // hardwareAcceleration: 'prefer-hardware',
  // avc:{ format: 'annexb' }
}

const mp4Demuxer = new MP4Demuxer()
const videoProcessor = new VideoProcessor({ mp4Demuxer })


onmessage = async ({ data }) => {
  await videoProcessor.start({
    file: data.file,
    encoderConfig: encoderConfig,
    sendMessage(message){
      self.postMessage(message)
    }
  })
  // Retornar para o app o status done depois de 2 segundos

  // self.postMessage({status: 'done'})


  // Podemos rodar um while true aqui, que tudo continua funcionando isso é massa. 
  // Ver como isso se comporta no navegador
  // while (true) {}
}

