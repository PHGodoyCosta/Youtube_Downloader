<div align=center>
    <img src="public/static/images/mg.png" alt="Logo do MG Multicoisas">
</div>

# Conversor MG Multicoisas de Vídeos do Youtube

>  Um App Electron que faz o download de vídeos, audios ou playlists do youtube.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-356e9f?style=for-the-badge&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-efd81c?style=for-the-badge&logo=javascript&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-32.1+-458590?style=for-the-badge&logo=electron&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0.3+-cc0100?style=for-the-badge&logo=flask&logoColor=white)
![FFMPEG](https://img.shields.io/badge/FFMPEG-388e3c?style=for-the-badge&logo=ffmpeg&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📎 Requerimentos

Para funcionar é necessário o download do FFMPEG na sua máquina:

[**FFMPEG**](https://ffmpeg.org/download.html)

Para rodar o programa no **Linux** é necessário o [**Python3**](https://www.python.org/downloads/) instalado + o download dos modulos em requirements.txt

```bash
$ pip3 install -r requirements.txt
```

## 🛠️ Funcionamento

Na prática são dois programas, o programa Electron que faz o papel de **client**, um servidor backend feito com Flask que funciona na **porta 53333**

Para saber mais informações sobre o desenvolvimento do projeto, porque ele se chama de **MG Multicoisas** e outros detalhes, segue o link para uma matéria completa publicada no meu site repositório:

**Link da Matéria Completa:** [https://phgodoycosta.com.br/projeto/youtube-conversor](https://phgodoycosta.com.br/projeto/youtube-conversor)

### Tela Inicial

<div align=center>
    <img src="public/static/images/tela_inicial.png" alt="Tela Inicial do conversor">
</div>

## 🔗 Download

Para fazer o download do programa, ele se encontra disponível pelos [**Releases do GitHub**](https://github.com/PHGodoyCosta/Youtube_Downloader/releases/latest)

A outra opção é clonar o código e fazer o build manualmente.

## 📦 Instalação

```bash
# Clonar o repositório
git clone https://github.com/PHGodoyCosta/Youtube_Downloader
cd Youtube_Downloader

# Instalar dependências Node
npm install
# ou usando pnpm
pnpm install

# Instalar dependências Python
pip3 install -r requirements.txt
```

Inicie primeiro o servidor Python Flask

```bash
python3 server/server.py
```

Depois inicie o Electron em modo develop

```bash
npm run start
```

### Build Local

Para realizar o build local, siga essas etapas:

#### Windows

```bash
npm run build:server:win
npm run build
```

#### Linux

```bash
$ npm run build
```

