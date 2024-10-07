import requests

class Y2Meta:
    def __init__(self):
        self.user_agent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0"
        self.proxies = {
            "http": "127.0.0.1:8080",
            "https": "127.0.0.1:8080"
        }
    
    def get_info(self, id):
        headers = {
            'Host': 'rr-03-bucket.cdn1313.net',
            'User-Agent': self.user_agent,
            'Accept': 'application/json',
            'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json',
            'Origin': 'https://y2meta.is',
            'Referer': 'https://y2meta.is/'
        }
        
        req = requests.get(f"https://rr-03-bucket.cdn1313.net/api/v4/info/{id}", headers=headers, verify=False)
        
        if req.status_code == 200:
            data = req.json()
            informations = {
                "title": data['title'],
                "duration": data['humanDuration'],
                "poster": f"https://i.ytimg.com/vi/{id}/0.jpg"
            }
            
            return informations
        
        return None
    
if __name__ == "__main__":
    starter = Y2Meta()
    info = starter.get_info("1UEpJ6ev3O4")
    print(info)