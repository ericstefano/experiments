globalThis.onmessage = async (event) => {
  console.log('Run in worker!')
  console.log(event.data)
}
