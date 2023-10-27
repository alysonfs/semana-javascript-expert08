import { DataStream, createFile } from '../deps/mp4box.0.5.2.js'
export default class MP4Demuxer {
  #onConfig 
  #onChunk
  #file
  /**
   * 
   * @param {ReadableStream} stream 
   * @param {object} options
   * @param {{config: object}} options.onConfig
   * 
   * @returns {Promise<void>}
   */
  async run(stream, { onConfig, onChunk}){
    this.#onConfig = onConfig
    this.#onChunk = onChunk

    this.#file  = createFile()
    this.#file.onReady = this.#onReady.bind(this)
    this.#file.onSamples = this.#onSamples.bind(this)

    this.#file.onError = (error) => {
      console.error('Error while parsing MP4 file', error)
    }

    this.#init(stream)
  }

  #description(track){
    const newTrack = this.#file.getTrackById(track.id)
    for(const entry of newTrack.mdia.minf.stbl.stsd.entries){
      const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C
      if(box){
        const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN)
        box.write(stream)
        return new Uint8Array(stream.buffer, 8) // Remove the box header
      }
    }

    throw new Error('avcC/hvcC/vpcC/av1C box not found')
  }

  #onSamples(trackId, ref, samples){
    debugger
  }

  #onReady(info){
    const [track] = info.videoTracks
    this.#onConfig({
      codec: track.codec,
      codedHeight: track.video.height,
      codedWidth: track.video.width,
      description: this.#description(track),
      durationSecs: info.duration / info.timescale,
    })

    this.#file.setExtractionOptions(track.id)
    this.#file.start()
  }

  /**
   * @param {ReadableStream} stream 
   * @returns Promise<void>
   */
  #init(stream){
    let _offset = 0
    const consumeFile = new WritableStream({
      /** @param {Uint8Array} chuck */
      write: (chuck)=> {
        const copy = chuck.buffer
        copy.fileStart = _offset
        this.#file.appendBuffer(copy)

        _offset += chuck.byteLength
      },
      close: () => {
        this.#file.flush()
      },
    })

    return stream.pipeTo(consumeFile)
  }
}