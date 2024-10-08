from flask import Flask, render_template, jsonify, request
from yt_dlp_conversor import YoutubeDownloader
from y2meta import Y2Meta
from uuid import uuid4 as v4

app = Flask(__name__)
downloader = YoutubeDownloader()
y2meta = Y2Meta()

master_queue = [] #Status = baixando, concluida

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/informations", methods=['POST'])
def informations():
    try:
        data = request.json
        #info = y2meta.get_info(data["id"])
        info = downloader.get_video_info(data["id"])
    except Exception as erro:
        return jsonify({
            "status": "error",
            "error": str(erro)
        })
    
    return jsonify({
        "status": "ok",
        "info": info
    })

@app.route("/queue/append", methods=['POST'])
def append_queue():
    data = request.json
    new_query = {
        "hash": str(v4()),
        "nome": data['nome'],
        "tipo": data['tipo'],
        "duracao": data['duracao'],
        "status": data['status'] if data['status'] else "baixando"
    }
    master_queue.append(new_query)
    
    test = jsonify(master_queue)
    print(test)
    return new_query

@app.route("/queue/status", methods=['POST'])
def set_status():
    data = request.json
    for q in range(0, len(master_queue)):
        print(f"1: {master_queue[q]['hash']} - 2: {data['hash']}")
        if master_queue[q]["hash"] == data["hash"]:
            master_queue[q]["status"] = data["status"]
            return master_queue[q]
    
    return jsonify({"status": "not-found"})
    

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
    if data["type"] == "mp3":
        download = downloader.download_sound(data["url"])
        
    elif data["type"] == "mp4":
        download = downloader.download_mp4(data["url"])
    
    return jsonify(download)

@app.route("/get_playlist_informations", methods=['POST'])
def playlist_informations():
    data = request.json
    try:
        real_link = downloader.getting_real_playlist_url(data["url"])
        informations = downloader.getting_links(real_link)
    except Exception as erro:
        return jsonify({
            "status": "error",
            "error": str(erro)
        })
    
    return jsonify(informations)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
    