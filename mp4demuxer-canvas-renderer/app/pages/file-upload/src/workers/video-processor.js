export default class VideoProcessor {
  #mp4Demuxer

  /**
   * 
   * @param {object} props
   * @param {import{'./mp4-demuxer.js'}.default} props.mp4Demuxer
   */
  constructor ({ mp4Demuxer }) {
    this.#mp4Demuxer = mp4Demuxer
  }

  mp4Decoder (encoderConfig, stream) {
    this.#mp4Demuxer.run(stream, {
      onConfig (config) {
        debugger
      },
      onChunk (chunk) {
        debugger
      }
    }
    )
  }

  async start ({ file, encoderConfig, sendMessage }) {
    const stream = file.stream()
    const fileName = file.name.split('/').pop().replace('.mp4', '')
    this.mp4Decoder(encoderConfig, stream)
  }
}