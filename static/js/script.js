document.addEventListener("DOMContentLoaded", e => {
    let converterOptions = {
        url: "",
        type: "mp3",
        typeUnity: "musica"
    }

    const mp3 = document.getElementById("mp3")
    const mp4 = document.getElementById("mp4")
    const musica = document.getElementById("musica")
    const playlist = document.getElementById("playlist")
    const main_input = document.querySelector(".main_input")
    const converter = document.getElementById("converter")
    const centerArea = document.getElementById("center-area")
    const queue = document.getElementById("queue")

    async function getVideoInformations(videoId) {
        const data = {
            id: videoId
        };
        
        try {
            const response = await fetch("http://127.0.0.1:3000/informations", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error('Erro ao fazer a requisição: ' + response.statusText);
            }
    
            const result = await response.json(); // Recebe a resposta em JSON
            //console.log(result)
            return result; // Faz algo com a resposta (exibe no console)
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    function getVideoIdByURL(link) {
        try {
            let url = new URL(link)
            let param = url.searchParams.get("v")
            return param
        } catch (error) {
            console.error(error)
            dispair_erro(0)
            return false
        }

    }

    function dispair_erro(code=0) {
        alert("disparando erro")
        let textError = ""
        let poster = "error-generic"
        switch(code) {
            case 0:
                textError = "É para colocar um link Maria, não bater a cabeça no teclado e dar enter! 🙄"
                break
            case 1:
                textError = "Parece que esse erro é mais avançado, você vai ter que chamar seu Godoyzinho querido para resolver 😁"
                break
        }

        centerArea.replaceChildren()
        create_dispair_erro(textError, poster)

    }

    converter.addEventListener("click", async(e) => {
        alert(1)
        let text = main_input.value
        converterOptions.url = text
        let videoId = getVideoIdByURL(text)
        if (videoId) {
            let informations = await getVideoInformations(videoId)

            console.log(informations)

            createMusicLoadingElement(informations.poster, informations.title, duration=informations.duration)
        }
    })

    mp4.addEventListener("click", e => {
        mp4.classList.remove("btn-light")
        mp4.classList.add("btn-primary")
        mp3.classList.remove("btn-primary")
        mp3.classList.add("btn-light")
        converterOptions.type = "mp4"
    })

    mp3.addEventListener("click", e => {
        mp3.classList.remove("btn-light")
        mp3.classList.add("btn-primary")
        mp4.classList.remove("btn-primary")
        mp4.classList.add("btn-light")
        converterOptions.type = "mp3"
    })

    musica.addEventListener("click", e => {
        musica.classList.remove("btn-light")
        musica.classList.add("btn-primary")
        playlist.classList.remove("btn-primary")
        playlist.classList.add("btn-light")
        converterOptions.type = "musica"
    })

    playlist.addEventListener("click", e => {
        playlist.classList.remove("btn-light")
        playlist.classList.add("btn-primary")
        musica.classList.remove("btn-primary")
        musica.classList.add("btn-light")
        converterOptions.type = "musica"
    })

    function createMusicLoadingElement(poster, title, duration="00:00", type="mp3") {
        // Criando a div principal
        let container = document.createElement('div');
        container.className = 'col d-flex justify-content-center mt-5';
        container.style.gap = '50px';
    
        // Criando a imagem
        let img = document.createElement('img');
        img.src = poster;
        img.alt = 'Imagem da música que está sendo baixada';
        img.className = 'poster';
    
        // Criando a div que conterá o texto e a barra de carregamento
        let textAndLoaderDiv = document.createElement('div');
        textAndLoaderDiv.className = "d-flex flex-column justify-content-center"
    
        // Criando o h2
        let title2 = document.createElement('h2');
        title2.textContent = title;

        let p = document.createElement('p')
        p.innerHTML = `${duration} | ${type} | ${type == "mp3" ? "63K" : "720p"}`
    
        // Criando o loader
        let loaderDiv = document.createElement('div');
        loaderDiv.className = 'loader';
    
        // Criando o texto de carregamento
        let loadingTextDiv = document.createElement('div');
        loadingTextDiv.className = 'loading-text';
        loadingTextDiv.innerHTML = 'Carregando<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
    
        // Criando o background da barra de carregamento
        let loadingBarBackgroundDiv = document.createElement('div');
        loadingBarBackgroundDiv.className = 'loading-bar-background';
    
        // Criando a barra de carregamento
        let loadingBarDiv = document.createElement('div');
        loadingBarDiv.className = 'loading-bar';
    
        // Criando o container das barras brancas
        let whiteBarsContainer = document.createElement('div');
        whiteBarsContainer.className = 'white-bars-container';
    
        // Adicionando as barras brancas
        for (let i = 0; i < 10; i++) {
            let whiteBar = document.createElement('div');
            whiteBar.className = 'white-bar';
            whiteBarsContainer.appendChild(whiteBar);
        }
    
        // Montando os elementos
        loadingBarDiv.appendChild(whiteBarsContainer);
        loadingBarBackgroundDiv.appendChild(loadingBarDiv);
        loaderDiv.appendChild(loadingTextDiv);
        loaderDiv.appendChild(loadingBarBackgroundDiv);
        textAndLoaderDiv.appendChild(title2);
        textAndLoaderDiv.appendChild(p)
        textAndLoaderDiv.appendChild(loaderDiv);
    
        // Adicionando a imagem e a div de texto e loader ao container principal
        container.appendChild(img);
        container.appendChild(textAndLoaderDiv);
    
        // Adicionando o container ao corpo da página (ou outro elemento)
        centerArea.replaceChildren()
        centerArea.appendChild(container);
    }

    function create_dispair_erro(message, poster="error-generic") {
        let container = document.createElement('div');
        container.className = 'col d-flex justify-content-center mt-5';
        container.style.gap = '50px';

        // Criando a imagem
        let img = document.createElement('img');
        img.src = `static/images/${poster}.jpg`; // URL para a imagem de erro
        img.alt = 'Imagem da música que está sendo baixada';
        img.className = 'poster';

        // Criando a div que conterá o título e a mensagem de erro
        let textDiv = document.createElement('div');

        // Criando o título (h2)
        let title = document.createElement('h2');
        title.textContent = '🚨 ERRO 🚨';

        // Criando a mensagem de erro (p)
        let errorMessage = document.createElement('p');
        errorMessage.id = 'erro-mesagem'; // Definindo o ID
        errorMessage.textContent = message;

        // Montando os elementos
        textDiv.appendChild(title);
        textDiv.appendChild(errorMessage);
        container.appendChild(img);
        container.appendChild(textDiv);

        centerArea.replaceChildren()
        centerArea.appendChild(container);
    }
    
    function organizingTheQueue(new_queue) {
        queue.replaceChildren()
        for (let i=0;i<new_queue.length;i++) {
            let actual = new_queue[i]
            //alert(actual)
            let tr = document.createElement("tr")
            tr.dataset.id = actual.hash

            let name = document.createElement("td")
            name.innerHTML = actual.nome

            let duracao = document.createElement("td")
            duracao.innerHTML = actual.duracao

            let status = document.createElement("td")
            //style="gap: 5px" class="d-flex align-items-center"
            status.style.gap = "5px"
            status.className = "d-flex align-items-center"
            let spanStatus = document.createElement("span")

            let imgStatus = document.createElement("img")
            imgStatus.className = "loading"
            //alert(actual.status)
            if (actual.status == "baixando") {
                //imgStatus.src = "{{ url_for('static', filename='images/pacman.gif') }}"
                imgStatus.src = "/static/images/pacman.gif"
                spanStatus.innerHTML = "Baixando"
            } else if (actual.status == "concluida") {
                imgStatus.src = "{{ url_for('static', filename='images/icons8-ok-32.png') }}"
                spanStatus.innerHTML = "Concluída"
            }

            let type = document.createElement("td")
            type.innerHTML = actual.tipo

            tr.appendChild(name)
            tr.appendChild(type)
            tr.appendChild(duracao)
            status.appendChild(spanStatus)
            status.appendChild(imgStatus)
            tr.appendChild(status)
            queue.appendChild(tr)
        }
    }

    function changeQueueStatus(hash, new_status) {

    }

    function getQueue() {
        try {
            return fetch("http://127.0.0.1:3000/queue")
        } catch (error) {
            console.error(error)
        }
    }

    window.addEventListener("load", async(e) => {
        let new_queue = await getQueue()
        new_queue = await new_queue.text()

        console.log(new_queue)
        
        organizingTheQueue(eval(new_queue))
    })

})