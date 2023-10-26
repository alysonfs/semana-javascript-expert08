onmessage = ({data}) => {
  
  // Retornar para o app o status done depois de 2 segundos
  setTimeout(() => {
    self.postMessage({status: 'done'})
  }, 2000);

  // Podemos rodar um while true aqui, que tudo continua funcionando isso é massa. 
  // Ver como isso se comporta no navegador
  // while (true) {}
}

