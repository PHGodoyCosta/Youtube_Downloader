document.addEventListener("DOMContentLoaded", e => {
    let converterOptions = {
        url: "",
        type: "mp3",
        typeUnity: "musica",
        downloadPath: "",
    }
    const apiServer = "http://127.0.0.1:3000"
    const mp3 = document.getElementById("mp3")
    const mp4 = document.getElementById("mp4")
    const musica = document.getElementById("musica")
    const playlist = document.getElementById("playlist")
    const main_input = document.querySelector(".main_input")
    const converter = document.getElementById("converter")
    const centerArea = document.getElementById("center-area")
    const playlistProgress = document.getElementById("playlist-progress-main")
    const playlistProgressTitle = document.getElementById("playlist-progress-title")
    const playlistLoaderProgress = document.getElementById("playlist-loader-progress")
    const directoryButton = document.getElementById("select-directory")
    const directoryText = document.getElementById("directory-text")
    const queue = document.getElementById("queue")

    async function getVideoInformations(videoId) {
        const data = {
            id: videoId
        };
        
        try {
            const response = await fetch(`${apiServer}/informations`, {
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

    function checkYoutubeURL(link, type=converterOptions.typeUnity) {
        try {
            let url = new URL(link)
            let param = url.searchParams.get("v")
            if (!param || url.href.indexOf("youtube.com") == -1) {
                dispair_erro(2)
                return false
            }

            return true
        } catch (error) {
            console.error(error)
            dispair_erro(0)
            return false
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

    function dispair_erro(code=0, message="") {
        let textError = ""
        let poster = "error-generic"
        switch(code) {
            case 0:
                textError = "É para colocar um link Maria, não bater a cabeça no teclado e dar enter! 🙄"
                break
            case 1:
                textError = "Parece que esse erro é mais avançado, você vai ter que chamar seu Godoyzinho querido para resolver 😁"
                poster = "error-1"
                break
            case 2:
                textError = "Coloca o link certo! mds... 😑"
                poster = "error-2"
                break
            case 3:
                textError = `Tira um print e mostra para o seu Godoyzinho favorito:<br><br>${message}`
                poster = "error-3"
                break
            case 4:
                textError = `O video que você colocou ai não existe 🙃<br>Na dúvida mostra isso para o Godoyzinho:<br><br>${message}`
                poster = "error-4"
                break
            case 5:
                textError = `Erro ao baixar a música da playlist<br><br>${message}`
                poster = "error-5"
                break
            case 6:
                textError = `Playlist incorreta! Você deve ter colocado um link de um mix ou uma playlist que não existe 🙃<br><br>${message}`
                poster = "error-generic"
        }

        centerArea.replaceChildren()
        create_dispair_erro(textError, poster)

    }

    function realConvertion() {
        return new Promise(async(resolve, reject) => {
            let c = await converting(text)
            c = await c.json()

            if (c.status == "ok") {
                await changeQueueStatus(queueItem.hash, "concluida")
                centerArea.replaceChildren()

            } else {
                await changeQueueStatus(queueItem.hash, "error")
                dispair_erro(3, message=`${c.error}<br>Link: ${text}`)
            }
        })
    }

    converter.addEventListener("click", async(e) => {
        //alert(1)
        let text = main_input.value
        converterOptions.url = text
        if (converterOptions.typeUnity == "musica") {
            createLoadingPlaylistElement(message="Carregando vídeo")
            if (checkYoutubeURL(text)) {
                let videoId = getVideoIdByURL(text)
                if (videoId) {

                    //let [_, informations] = await Promise.all([realConvertion(), getVideoInformations(videoId)])
                    let informations = await getVideoInformations(videoId)
                    
                    if (informations.status == "error") {
                        return dispair_erro(4, informations.error)
                    }

                    informations = informations.info

                    let queueItem = await appendQueue(informations.title, converterOptions.type, duration=informations.duration, "baixando")

                    console.log(queueItem)

                    createMusicLoadingElement(informations.poster, informations.title, duration=informations.duration)

                    let c = await converting(`https://youtube.com/watch?v=${videoId}`)
                    c = await c.json()

                    if (c.status == "ok") {
                        await changeQueueStatus(queueItem.hash, "concluida")
                        centerArea.replaceChildren()

                    } else {
                        await changeQueueStatus(queueItem.hash, "error")
                        dispair_erro(3, message=`${c.error}<br>Link: ${text}`)
                    }
                }
            }
            
        } else if (converterOptions.typeUnity == "playlist") {
            createLoadingPlaylistElement()
            let informations = await getPlaylistInformations(text)
            if (informations.status == "error") {
                return dispair_erro(6, informations.error)

            }
            createPlaylistProgress(informations.playlist_count)
            
            for (let i=0;i<informations.playlist_count;i++) {
                let musica = informations.musicas[i]

                //createMusicLoadingElement(musica.poster, musica.title, duration=musica.duration)

                console.log(musica.title)

                // let videoInformations = await getVideoInformations(musica.id)
                    
                // if (videoInformations.status == "error") {
                //     dispair_erro(4, videoInformations.error)

                // } else {
                //     videoInformations = videoInformations.info

                //     let queueItem = await appendQueue(videoInformations.title, converterOptions.type, duration=videoInformations.duration, "baixando")

                //     console.log(queueItem)

                //     createMusicLoadingElement(videoInformations.poster, videoInformations.title, duration=videoInformations.duration)
                // }

                let queueItem = await appendQueue(musica.title, converterOptions.type, duration=musica.duration, "baixando")

                console.log(queueItem)

                createMusicLoadingElement(musica.poster.url, musica.title, duration=musica.duration)

                let c = await converting(musica.url)
                c = await c.json()

                if (c.status == "ok") {
                    centerArea.replaceChildren()
                    await changeQueueStatus(queueItem.hash, "concluida")
                    atualizandoPlaylistProgress(i + 1, informations.playlist_count)

                } else {
                    await changeQueueStatus(queueItem.hash, "error")
                    dispair_erro(3, message=`${c.error}<br>Link: ${text}`)
                }
            }

            cancelandoPlaylistProgress()

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
        converterOptions.typeUnity = "musica"
    })

    playlist.addEventListener("click", e => {
        playlist.classList.remove("btn-light")
        playlist.classList.add("btn-primary")
        musica.classList.remove("btn-primary")
        musica.classList.add("btn-light")
        converterOptions.typeUnity = "playlist"
    })

    directoryButton.addEventListener("click", async () => {
        let path = await window.electronAPI.selectDirectory()
        definePath(path)
    })

    function createMusicLoadingElement(poster, title, duration="00:00", type="mp3") {
        // Criando a div principal
        let container = document.createElement('div');
        container.className = 'col d-flex justify-content-center mt-5';
        container.style.gap = '50px';
        container.style.maxWidth = "80%"
    
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

    function createPlaylistProgress(total_musicas) {
        playlistProgress.style.display = "block"
        playlistProgressTitle.innerHTML = `Baixando 0 de ${total_musicas}`
    }

    function atualizandoPlaylistProgress(baixadas, total_musicas) {
        let porcentagem = (baixadas * 100) / total_musicas
        playlistProgressTitle.innerHTML = `Baixando ${baixadas} de ${total_musicas}`
        playlistLoaderProgress.style.width = `${porcentagem}%`
    }

    function cancelandoPlaylistProgress() {
        playlistProgress.style.display = "none"
        playlistLoaderProgress.style.width = "0"
    }

    function create_dispair_erro(message, poster="error-generic") {
        let container = document.createElement('div');
        container.className = 'col d-flex justify-content-center mt-5';
        container.style.gap = '50px';

        // Criando a imagem
        let img = document.createElement('img');
        img.src = `../static/images/${poster}.jpg`; // URL para a imagem de erro
        img.alt = 'Imagem da música que está sendo baixada';
        img.className = 'poster';

        // Criando a div que conterá o título e a mensagem de erro
        let textDiv = document.createElement('div');

        // Criando o título (h2)
        let title = document.createElement('h2');
        title.textContent = '🚨 ERRO! 🚨';

        // Criando a mensagem de erro (p)
        let errorMessage = document.createElement('p');
        errorMessage.id = 'erro-mesagem'; // Definindo o ID
        errorMessage.innerHTML = message;

        // Montando os elementos
        textDiv.appendChild(title);
        textDiv.appendChild(errorMessage);
        container.appendChild(img);
        container.appendChild(textDiv);

        centerArea.replaceChildren()
        centerArea.appendChild(container);
    }

    function createLoadingPlaylistElement(message='Carregando Playlist') {
        // Criando a div principal
        const container = document.createElement('div');
        container.className = 'col d-flex flex-column justify-content-center align-items-center mt-5';
    
        // Criando o título (h2)
        const title = document.createElement('h2');
        title.textContent = message;
    
        // Criando a imagem de loading
        const img = document.createElement('img');
        img.src = '../static/images/loading.gif';
        img.alt = 'Loading normal para carregamento da playlist';
    
        // Montando os elementos
        container.appendChild(title);
        container.appendChild(img);
    
        centerArea.replaceChildren()
        centerArea.appendChild(container);
    }
    
    function organizingTheQueue(new_queue) {
        //alert(new_queue)
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
            //alert(String(actual))
            if (actual.status == "baixando") {
                //imgStatus.src = "{{ url_for('static', filename='images/pacman.gif') }}"
                imgStatus.src = "../static/images/pacman.gif"
                spanStatus.innerHTML = "Baixando"
                //alert(spanStatus.innerHTML)
            } else if (actual.status == "concluida") {
                imgStatus.src = "../static/images/icons8-ok-32.png"
                spanStatus.innerHTML = "Concluída"
            } else if (actual.status == "error") {
                imgStatus.src = "../static/images/icon_error.png"
                spanStatus.innerHTML = "Erro"
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

    async function changeQueueStatus(hash, new_status) {
        try {
            const response = await fetch(`${apiServer}/queue/status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // Definindo o cabeçalho para JSON
                },
                body: JSON.stringify({
                    hash: hash,
                    status: new_status
                })
            })
            organizingTheQueue(await getQueue())
            return await response.json();

        } catch (error) {
            console.error(error)
        }
    }

    async function appendQueue(nome, tipo, duracao, status) {
        try {
            const queue = await getQueue()
            if (queue.length + 1 > 20) {
                await deleteQueue(queue[0].hash)
            }
            const response = await fetch(`${apiServer}/queue/append`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // Definindo o cabeçalho para JSON
                },
                body: JSON.stringify({
                    nome: nome,
                    tipo: tipo,
                    duracao: duracao,
                    status: status ?? "baixando"
                })
            })
            
            organizingTheQueue(await getQueue())
            return await response.json();
        } catch (error) {
            console.error(error)
        }
    }

    async function deleteQueue(hash) {
        //alert(hash)
        try {
            const response = await fetch(`${apiServer}/queue/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // Definindo o cabeçalho para JSON
                },
                body: JSON.stringify({
                    hash: hash
                })
            })

            organizingTheQueue(await getQueue())
            return await response.json();
        } catch (error) {
            console.error(error)
        }
    }

    async function converting(url, type=converterOptions.type, typeUnity=converterOptions.typeUnity, downloadPath=converterOptions.downloadPath) {
        try {
            const response = await fetch(`${apiServer}/converter`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // Definindo o cabeçalho para JSON
                },
                body: JSON.stringify({
                    type: type,
                    url: url,
                    downloadPath: downloadPath
                })
            })
            
            return response;
        } catch (error) {
            console.error(error)
        }
    }

    async function getPlaylistInformations(url) {
        try {
            const response = await fetch(`${apiServer}/get_playlist_informations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: url
                })
            })
            
            const result = await response.json(); // Recebe a resposta em JSON

            return result;
        } catch (error) {
            console.error(error)
        }
    }

    function getQueueHashByChildren(i=queue.children.length-1) {
        //alert(i)
        return queue.children[i].dataset.id
    }

    async function getQueue() {
        try {
            let response = await fetch(`${apiServer}/queue`)
            return await response.json()
        } catch (error) {
            console.error(error)
        }
    }

    function definePath(path) {
        directoryText.innerHTML = `<strong>Local:</strong> ${path}`
        converterOptions.downloadPath = path
    }

    window.addEventListener("load", async(e) => {
        let new_queue = await getQueue()

        //console.log(new_queue)
        
        organizingTheQueue(new_queue)

        let path = await window.electronAPI.getDownloadPath()
        definePath(path)

        //let item = await appendQueue("Acabei de inventar", "mp4", "03:00", "baixando")
        //console.log(item)
        //appendQueue("Acabei de inventar2", "mp3", "03:50", "baixando")
        //await deleteQueue(getQueueHashByChildren(0))
        //await deleteQueue(getQueueHashByChildren())

        // setTimeout(e => {
        //     changeQueueStatus(item.hash, "concluida")
        // }, 3000)

        // setTimeout(e => {
        //     deleteQueue(item.hash)
        // }, 3000)
        // createPlaylistProgress(10)

        // atualizandoPlaylistProgress(6, 10)

        
    })

    window.addEventListener("keydown", e => {
        if (e.key == "Enter") {
            if (main_input.value != "") {
                converter.click()
            }
        }
    })
})