const express = require('express');
const routes = express.Router('');
//__dirname -> pega o nome do diretório atual
//não prteciso mais basePath pois "ejs" já lê automaticamente nossa pasta views
//const basePath = __dirname + "/views";//raiz no nosso arquivo
//request, response
const views = __dirname + "/views/";

const profile = {

    name: "Ricardo Filho",
    avatar: "https://avatars.githubusercontent.com/u/74803287?s=400&u=d5d82e563f8b02b79447c6c832806a60dae9fb95&v=4",
    'monthly-budget':"3000",
    'days-per-week':"5",
    'hours-per-day':"5",
    'vacation-per-year':4

}

routes.get("/", (request, response) =>  response.render(views+"index.ejs"));
routes.get("/job", (request, response) => response.render(views+"job.ejs"));
routes.get("/job-edit", (request, response) => response.render(views+"job-edit.ejs"));
routes.get("/profile", (request, response) =>  response.render(views+"profile.ejs", {profile: profile}));

    
module.exports = routes;

   