const express = require("express");
const server = express();
const routes = require('./routes');
const path = require('path');


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