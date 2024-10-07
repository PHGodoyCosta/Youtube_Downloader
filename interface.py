import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl 
from server import app

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        #app.run(host="0.0.0.0", port=3000)
        self.setWindowTitle('Youtube Conversor')
        self.setGeometry(100, 100, 800, 600)

        # Criar o QWebEngineView
        self.browser = QWebEngineView()

        # Carregar uma página HTML (URL externa ou arquivo local)
        self.browser.setUrl(QUrl('http://127.0.0.1:3000/'))

        # Layout para adicionar o navegador à janela
        layout = QVBoxLayout()
        layout.addWidget(self.browser)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())

if __name__ == '__main__':
    main()
