const express = require("express");
const server = express();
const routes = require('./routes');
const path = require('path');

//__dirname -> pega o nome do diretório atual
//não prteciso mais basePath pois "ejs" já lê automaticamente nossa pasta views
//const basePath = __dirname + "/views";//raiz no nosso arquivo
//request, response

//usando template engine
server.set("views engine", "ejs");

//Mudar localização da pasta views
server.set('views',path.join(__dirname,'views'));

//habilitar arquivos estáticos _> pasta "public" 
server.use(express.static("public"));

//usar o request.body
server.use(express.urlencoded({ extend: true }))

//routes   
server.use(routes);
server.listen(3000, () => console.log("rodando")); 