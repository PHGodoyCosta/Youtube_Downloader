import youtube_dl

def get_video_info(url):
    # Opções para não baixar o vídeo, só pegar informações
    ydl_opts = {
        'format': 'best',
        'noplaylist': True,  # Para garantir que não vai tentar baixar uma playlist
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)  # Pega as informações sem baixar o vídeo

    return {
        "title": info.get('title'),
        "duration": info.get('duration'),
        "thumbnail": info.get('thumbnail'),
        "view_count": info.get('view_count'),
        "like_count": info.get('like_count'),
    }

video_url = 'https://www.youtube.com/watch?v=lXSZn71C9zU'
video_info = get_video_info(video_url)

print(f"Título: {video_info['title']}")
print(f"Duração: {video_info['duration']} segundos")
print(f"Link da miniatura: {video_info['thumbnail']}")
print(f"Visualizações: {video_info['view_count']}")
print(f"Likes: {video_info['like_count']}")
