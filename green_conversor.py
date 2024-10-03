import requests
from urllib.parse import urlparse, parse_qs
from time import sleep

class Downloader:
    def __init__(self, url, isPlaylist=False):
        self.url = url
        self.isPlaylist = isPlaylist
        self.user_agent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0"
        self.proxies = {
            "http": "127.0.0.1:8080",
            "https": "127.0.0.1:8080"
        }
        
    def init(self, url):
        headers = {
            'Host': 'ii.ymcdn.org',
            'User-Agent': self.user_agent,
            'Accept': '*/*',
            'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'multipart/form-data; boundary=---------------------------849983406211932203985283908',
            'Origin': 'https://pt1.greenconvert.net',
        }
        
        video_id = self.getting_id_from_youtube_url(url)
        
        body = f"""
-----------------------------849983406211932203985283908
Content-Disposition: form-data; name="id"

{video_id}
-----------------------------849983406211932203985283908--
"""
        
        req = requests.post("https://ii.ymcdn.org/api/v3/init", data=body, headers=headers, verify=False)
        
        if req.status_code == 200:
            response = req.json()
            
            return response.get("hash")
        raise Exception("Erro na requisição inicial")

    def progress(self, hash, firstFalse=False):
        headers = {
            'Host': 'ii.ymcdn.org',
            'User-Agent': self.user_agent,
            'Accept': '*/*',
            'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'multipart/form-data; boundary=---------------------------3855561575317018898171890485',
            'Origin': 'https://pt1.greenconvert.net',
        }
        
        video_id = self.getting_id_from_youtube_url(url)
        
        body = f"""
-----------------------------3855561575317018898171890485
Content-Disposition: form-data; name="id"

{hash}
-----------------------------3855561575317018898171890485
Content-Disposition: form-data; name="s"

100
-----------------------------3855561575317018898171890485--
"""
        
        req = requests.post("https://ii.ymcdn.org/api/v3/progress", data=body, headers=headers, proxies=self.proxies, verify=False)
        
        if req.status_code == 200:
            response = req.json()
            
            if str(response.get("status")).lower() == "true" and response.get("result") != None:
                video_data = {
                    "title": response["videoDetail"]["title"],
                    "duration": response["videoDetail"]["duration"],
                    "thumb": response["videoDetail"]["thumbnailUrl"]
                }
                
                audio_formats = response["videoDetail"]["formats"]["sounds"][0]
                
                return audio_formats["bitrate"]
            elif firstFalse:
                return None
            
            else:
                while True:
                    print(f"Repetição - STATUS={str(response.get('status'))}")
                    sleep(3)
                    if self.progress(hash):
                        break
                
        raise Exception("Erro na requisição inicial")
        
    
    def getting_id_from_youtube_url(self, url, type="video"):
        if type == "video":
            parsed_url = urlparse(url)

            query_params = parse_qs(parsed_url.query)

            return query_params.get('v', [None])[0]
        

if __name__ == "__main__":
    url = "https://www.youtube.com/watch?v=uYYgJ9gRpVs"
    starter = Downloader(url)
    hash = starter.init(url)
    print(hash)
    starter.progress(hash, firstFalse=True)
    bitrate = starter.progress(hash)
    print(bitrate)
    