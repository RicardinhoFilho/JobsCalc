const express = require('express');
const routes = express.Router('');
//__dirname -> pega o nome do diretório atual
//não prteciso mais basePath pois "ejs" já lê automaticamente nossa pasta views
//const basePath = __dirname + "/views";//raiz no nosso arquivo
//request, response
const views = __dirname + "/views/";

const profile = {

    name: "Ricardo Filho",
    avatar: "https://github.com/RicardinhoFilho.png",
    'monthly-budget': "3000",
    'days-per-week': "5",
    'hours-per-day': "5",
    'vacation-per-year': 4,
    "value-hour": 25

}

const jobs = [
    {
        id: 1,
        name: "Pizzaria Guloso",
        "daily-hours": 2,
        "total-hours": 1,
        createdAt: Date.now()
    },
    {
        id: 2,
        name: "One-TwoProject",
        "daily-hours": 3,
        "total-hours": 47,
        createdAt: Date.now()
    }

];

function remainingDays(job) {

    const remainingDays = (job['total-hours'] / job['daily-hours']).toFixed();//toFixed arredonda números(2.49 = 2, 2.50 = 3)

    const createdDate = new Date(job.createdAt);//pega a data nos millisegundos e transforma em uma data formatada
    //dueDay-> dia de vencimento
    const dueDay = createdDate.getDate() + Number(remainingDays);//utilizo Number() porque toFixed transformou meu numero em string
    //Data de vencimento
    const dueDateInMs = createdDate.setDate(dueDay);//Data que começamos o projeto setDate(dia de vencimento)

    const timeDiffInMs =  dueDateInMs - Date.now();
    //transformar millisegundos em dias
    const dayInMs = 1000 * 60 * 60 * 24;
    const dayDiff = Math.floor((timeDiffInMs / dayInMs));

    return dayDiff;

}

routes.get("/", (request, response) => {

    //ajustes no job
    //calculo d etempo restante

    const uptedJobs = jobs.map((job) => {

        const remaining = remainingDays(job);
        const status = remaining <= 0 ? "done" : "progress";

        return {
            ...job,
            remaining,
            status,
            budget: profile['value-hour'] * job['total-hours']
        };
    });



    return response.render(views + "index.ejs", { jobs: uptedJobs })
}
);
routes.get("/job", (request, response) => response.render(views + "job.ejs"));
routes.post("/job", (request, response) => {
    //console.log(request.body);//temos que habilitar -> server.use(express.urlencoded({ extend: true })) em server.js

    const lastId = jobs[jobs.length - 1]?.id || 1;//pega o id do ultimo elemento, se não achar id será 1

    const job = request.body;
    jobs.push({
        id: lastId + 1,
        name: request.body.name,
        "daily-hours": request.body["daily-hours"],
        "total-hours": request.body["total-hours"],
        createdAt: Date.now()
    });
    return response.redirect("/")
})
routes.get("/job-edit", (request, response) => response.render(views + "job-edit.ejs"));
routes.get("/profile", (request, response) => response.render(views + "profile.ejs", { profile: profile }));


module.exports = routes;

