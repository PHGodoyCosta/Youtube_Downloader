async function sendVideoId(videoId) {
    const url = "http://127.0.0.1:3000/informations";  // Rota do seu servidor Flask
    const data = {
        id: videoId
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Envia o ID em formato JSON
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer a requisição: ' + response.statusText);
        }

        const result = await response.json(); // Recebe a resposta em JSON
        console.log(result); // Faz algo com a resposta (exibe no console)
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Exemplo de uso
sendVideoId("lXSZn71C9zU");