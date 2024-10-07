// async function sendVideoId(videoId) {
//     const url = "http://127.0.0.1:3000/queue";  // Rota do seu servidor Flask
//     const data = {
//         id: videoId
//     };
    
//     try {
//         const response = await fetch(url);

//         if (!response.ok) {
//             throw new Error('Erro ao fazer a requisição: ' + response.statusText);
//         }

//         const result = await response.json(); // Recebe a resposta em JSON
//         console.log(result); // Faz algo com a resposta (exibe no console)
//     } catch (error) {
//         console.error('Erro:', error);
//     }
// }

// async function getQueue() {
//     try {
//         let response = await fetch("http://127.0.0.1:3000/queue")
//         return await response.json()
//     } catch (error) {
//         console.error(error)
//     }
// }

// async function run() {
//     let response = await getQueue()
//     console.log(response)
// }

// run()
// Exemplo de uso
//sendVideoId("lXSZn71C9zU");



for (let i=0;i<10;i++) {
    console.log(i)
    if (i == 5) {
        break
    }
}