const express = require("express");
const server = express();
const routes =  require('./routes');

//usando template engine
server.set("views engine", "ejs");

//habilitar arquivos estáticos _> pasta "public" 
server.use(express.static("public"));
 
 
//routes   
server.use(routes);
server.listen(3000, ()=>console.log("rodando")); 