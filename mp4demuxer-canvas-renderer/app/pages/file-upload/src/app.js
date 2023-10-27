import Clock from './deps/clock.js';
import View from './view.js';

const clock = new Clock()
const view = new View()

const worker = new Worker('./src/workers/worker.js', { type: 'module' })

worker.onerror = (error) => {
    console.error('Error on worker', error) 
}

worker.onmessage = ({data}) => {
    if(data.status !== 'done') return
    clock.stop()
    view.updateElapsedTime(`Process took ${took.replace('ago', '')}`)
}

let took = ''

view.configureOnFileChange(file => {
    worker.postMessage({file})
    
    clock.start((time) => {
        took = time;
        view.updateElapsedTime(`Process started ${time}`)
    })
})

// Carrega automaticamente o video
async function fakeFetch () {
    const filePath = '/videos/frag_bunny.mp4'

    const response = await fetch(filePath)
    // Captura o tamanho do video
    // const response = await fetch(filePath, {
    //     method: 'HEAD'
    // })
    // const sizeVideo = response.headers.get('content-length')
    // debugger

    const file = new File([await response.blob()], filePath, {
        type: 'video/mp4',
        lastModified: new Date()
    })

    const event = new Event('change')
    Reflect.defineProperty(event, 'target', { value: { files: [file] } })
    document.getElementById('fileUpload').dispatchEvent(event)
}

fakeFetch()