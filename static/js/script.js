document.addEventListener("DOMContentLoaded", e => {
    let converterOptions = {
        type: "mp3",
        typeUnity: "musica"
    }

    const mp3 = document.getElementById("mp3")
    const mp4 = document.getElementById("mp4")
    const musica = document.getElementById("musica")
    const playlist = document.getElementById("playlist")

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
})