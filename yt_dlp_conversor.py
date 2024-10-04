import yt_dlp
from urllib.parse import urlparse
import os

class YoutubeDownloader:
    def __init__(self, url="", path="/tmp"):
        self.url = url
        self.setting_the_path(path)
    
    def download_sound(self, url):
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
    
    def download_mp4(self, url):
        pass
    
    def setting_the_path(self, path):
        self.path = path
        os.chdir(self.path)
    
    def getting_real_playlist_url(self, playlist_url):
        parsed_url = urlparse(playlist_url)

        path = parsed_url.path

        path_parts = path.strip('/').split('/')

        if not 'playlist' in path_parts and path_parts[0]:
            ydl_opts = {
                'quiet': True,
                'extract_flat': True,
                'force_generic_extractor': True,
            }

            # Função para obter os links da playlist
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(playlist_url, download=False)
                return info_dict["url"]
        return str(playlist_url)
    
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
            video_links = [entry['url'] for entry in info_dict['entries']]
            return video_links
    
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
                
if __name__ == "__main__":
    starter = YoutubeDownloader(path=".")
    #links = starter.getting_links("https://www.youtube.com/watch?v=CPFYqt7JOU4") #https://www.youtube.com/playlist?list=PLSeKWDqO5F9dvynyjFEVyEIR3MoPZEEiw
    #starter.download_sound("https://www.youtube.com/watch?v=UILtPpRZ_G0")
    informations = starter.getting_informations("https://www.youtube.com/watch?v=lXSZn71C9zU")
    print(informations)
    
    #https://www.youtube.com/watch?v=tdL58UvcwaA&list=PLSeKWDqO5F9dvynyjFEVyEIR3MoPZEEiw