from flask import Flask, render_template, jsonify, request
from yt_dlp_conversor import YoutubeDownloader
from y2meta import Y2Meta
from uuid import uuid4 as v4

app = Flask(__name__)
downloader = YoutubeDownloader()
y2meta = Y2Meta()

master_queue = [#Status = baixando, concluida
    {
        "hash": str(v4()),
        "nome": "nome Teste",
        "tipo": "mp3",
        "duracao": "02:30",
        "status": "baixando"
    }
]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/informations", methods=['POST'])
def informations():
    data = request.json
    info = y2meta.get_info(data["id"])
    
    return jsonify(info)

@app.route("/queue/append", methods=['POST'])
def append_queue():
    data = request.json
    master_queue.append({
        "hash": str(v4()),
        "nome": data['nome'],
        "tipo": data['tipo'],
        "duracao": data['duracao'],
        "status": data['status'] if data['status'] else "baixando"
    })
    
    return jsonify(master_queue)

@app.route("/queue/delete", methods=['POST'])
def delete_queue():
    data = request.json
    for q in range(0, len(master_queue)):
        if master_queue[q]["hash"] == data["hash"]:
            del master_queue[q]
    
    return jsonify(master_queue)

@app.route("/queue")
def queue():
    return jsonify(master_queue)


@app.route("/converter", methods=['POST'])
def converter():
    data = request.json
    if data["typeUnity"] == "musica":
        if data["type"] == "mp3":
            downloader.download_sound(data["url"])
        elif data["type"] == "mp4":
            downloader.download_mp4(data["url"])
    elif data["typeUnity"] == "playlist":
        real_link = downloader.getting_real_playlist_url(data["url"])
        links = downloader.getting_links(real_link)
        for link in links:
            if data["type"] == "mp3":
                downloader.download_sound(link)
            elif data["type"] == "mp4":
                downloader.download_mp4(link)
    
    
    return jsonify({"status": "ok"})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)