import yt_dlp
from urllib.parse import urlparse, parse_qs
import os

class YoutubeDownloader:
    def __init__(self, url="", path="/tmp"):
        self.url = url
        self.setting_the_path(path)
    
    def download_sound(self, url):
        try:
            ydl_opts = {
                'format': 'bestaudio/best',    # Baixar a melhor qualidade de áudio disponível
                'extractaudio': True,           # Extrair o áudio
                'audioformat': 'mp3',           # Converter para MP3
                'postprocessors': [{             # Adicionar um processador pós-download
                    'key': 'FFmpegExtractAudio', # Usar FFmpeg para extrair o áudio
                    'preferredcodec': 'mp3',     # Definir o codec preferido para MP3
                    'preferredquality': '192',    # Qualidade do MP3 (pode ser 128, 192, 256, 320)
                }],
                'outtmpl': '%(title)s.%(ext)s',  # Nome do arquivo de saída
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
        except Exception as error:
            return {
                "status": "error",
                "error": str(error)
            }
        
        return {"status": "ok"}
    
    def download_mp4(self, url):
        try:
            ydl_opts = {
                'format': 'bv*[vcodec^=avc1]+ba/b[ext=mp4]/worst',  # Forçar H.264 e MP4 -> bv*[vcodec^=avc1]+ba/b[ext=mp4]
                'merge_output_format': 'mp4',  # Combinar vídeo e áudio em MP4
                'outtmpl': '%(title)s.%(ext)s',  # Nome do arquivo de saída
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
        except Exception as error:
            return {
                "status": "error",
                "error": str(error)
            }
        
        return {"status": "ok"}
    
    def setting_the_path(self, path):
        self.path = path
        os.chdir(self.path)
    
    def getting_real_playlist_url(self, playlist_url):
        parsed_url = urlparse(playlist_url)

        path = parsed_url.path

        path_parts = path.strip('/').split('/')

        if not 'playlist' in path_parts and path_parts[0]:
            query = parse_qs(parsed_url.query)
            
            if query['list']:
                return f"https://www.youtube.com/playlist?list={query['list'][0]}"
            
            return False
        return str(playlist_url)

    def format_number_time(self, num):
        if num < 10:
            return f"0{num}"
        return num
    
    def convert_duration_time(self, time, type="seconds"):
        time = int(time if time != None else 0)
        # if type == "seconds":
        #     min = int(time / 60)
        #     sec = int(time % 60)
            
        #     return f"{min}:{self.format_number_time(sec)}"
        hours, remainder = divmod(time, 3600)
    
        # Calcula o número de minutos e o restante de segundos
        minutes, seconds = divmod(remainder, 60)
        
        if hours:
            return f"{hours}:{minutes}:{self.format_number_time(seconds)}"
        return f"{minutes}:{self.format_number_time(seconds)}"

    
    def getting_links(self, playlist):
        playlist = self.getting_real_playlist_url(playlist)
        
        ydl_opts = {
            'quiet': True,  # Para evitar a saída de log excessivo
            'extract_flat': True,  # Extrair apenas as informações da playlist
            'force_generic_extractor': True,  # Forçar o uso do extrator genérico
        }

        # Função para obter os links da playlist
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(playlist, download=False)
            #entries = info_dict['entries']
            with open("test.json", "w+") as f:
                f.write(str(info_dict))
            
            informations = {
                "playlist_title": info_dict["title"],
                "playlist_count": info_dict["playlist_count"],
                "musicas": []
            }
            
            for musica in info_dict["entries"]:
                informations["musicas"].append({
                    "title": musica["title"],
                    "id": musica["id"],
                    "url": musica["url"],
                    "duration": self.convert_duration_time(time=musica["duration"]),
                    "poster": musica["thumbnails"][0]
                })
            
            return informations
        
    def get_video_info(self, url_id):
        # Definir opções sem baixar o vídeo
        ydl_opts = {
            'quiet': True,
            'skip_download': True,  # Não baixa o vídeo, só obtém informações
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extrai as informações do vídeo
            info_dict = ydl.extract_info(f"https://youtube.com/watch?v={url_id}", download=False)
            
            with open("test.json", "w+") as f:
                f.write(str(info_dict))
            # Pega o título do vídeo
            video_title = info_dict.get('title', None)
            id = info_dict.get("id", None)
            duration = info_dict.get('duration', None)
            
            return {
                "poster": f"https://i.ytimg.com/vi/{id}/0.jpg",
                "title": video_title,
                "duration": duration
                
            }
    
    def getting_informations(self, url):
        #POSTER -> https://i.ytimg.com/vi/YOtlQlEtygs/0.jpg
        ydl_opts = {
            'format': 'best',  # Não baixa, apenas coleta informações
            'skip_download': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extrai as informações do vídeo
            info = ydl.extract_info(url, download=False)
            with open("test.json", "w+") as f:
                f.write(str(info))
            print(info['title'])
            print(info['duration'])

        # Pegando algumas informações específicas
        '''video_title = info.get('title', 'N/A')
        video_duration = info.get('duration', 'N/A') 
        video_thumbnail = info.get('thumbnail', 'N/A')

        return {
            "title": video_title,
            "duration": video_duration,  # Duração em segundos
            "thumbnail": video_thumbnail,  # Link para o thumbnail
        }'''
    
    def download_playlist(self, url, mode="mp3"):
        real_url = self.getting_real_playlist_url(url)
        links = self.getting_links(real_url)
        
        # os.chdir("/tmp/musicas")
        # self.download_sound(url)
        
        return links
                
if __name__ == "__main__":
    starter = YoutubeDownloader(path=".")
    playlist_link = "https://www.youtube.com/watch?v=YYTBoHIvXaY&list=PLbgMeGddi8GEKHqdrES-864mJ7EvLBVk5"
    #links = starter.download_playlist(playlist_link) #https://www.youtube.com/playlist?list=PLSeKWDqO5F9dvynyjFEVyEIR3MoPZEEiw
    #starter.download_sound("https://www.youtube.com/watch?v=UILtPpRZ_G0")
    #informations = starter.getting_informations("https://www.youtube.com/watch?v=lXSZn71C9zU")
    #links = starter.get_video_info("https://www.youtube.com/watch?v=bP9hFz78L28")
    starter.download_mp4("https://www.youtube.com/watch?v=zf8qsgBCYT4")
    #print(links)
    
    #https://www.youtube.com/watch?v=tdL58UvcwaA&list=PLSeKWDqO5F9dvynyjFEVyEIR3MoPZEEiw