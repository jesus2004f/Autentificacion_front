from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/token",methods=["GET"])
def buscar():
    return render_template('token.html')

@app.route("/contactos")
def contactos():
    return render_template('contactos.html')

@app.route("/buscar")
def bus():
    return render_template('buscar.html')

@app.route("/insertar",methods=["GET","POST"])
def insertar():
    return render_template('insertar.html')

@app.route("/ver",methods=["GET"])
def ver():
    return render_template('ver.html')

@app.route("/borrar",methods=["GET", "POST"])
def borrar():
    return render_template('borrar.html')

@app.route("/editar",methods=["GET", "POST"])
def editar():
    return render_template('editar.html')