const express = require('express');
const routes = express.Router('');
//__dirname -> pega o nome do diretório atual
//não prteciso mais basePath pois "ejs" já lê automaticamente nossa pasta views
//const basePath = __dirname + "/views";//raiz no nosso arquivo
//request, response
const views = __dirname + "/views/";

const Profile = {

    data: {
        name: "Ricardo Filho",
        avatar: "https://github.com/RicardinhoFilho.png",
        'monthly-budget': "3000",
        'days-per-week': "5",
        'hours-per-day': "5",
        'vacation-per-year': 4,
        "value-hour": 25
    },

    controllers: {
        index(request, response) {
            return response.render(views + "profile.ejs", { profile: Profile.data })
        },
        update(request, response) {
            //request.body para pegar os dados 
            const data = request.body;

            //definir quantas semanas tem um ano: 52
            const weeksPerYear = 52;

            //remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mês
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;

            //quantas horas por semana estou trabalhando (horas por dia * dias da semana)
            weekTotalHours = data["hours-per-day"] * data["days-per-week"];

            //total de horas trabalhadas no mês
            monthlyTotalHours = weekTotalHours * weeksPerMonth;

            //qual valor da minha hora
            const valueHour = data["monthly-budget"] / monthlyTotalHours;

            Profile.data = {
                ...Profile.data,
                ...request.body,
                "value-hour": valueHour

            }

            return response.redirect('/profile');
        }
    }
}

const Job = {
    data: [
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
    ],
    controllers: {

        //ajustes no job
        //calculo d etempo restante
        index(request, response) {
            const uptedJobs = Job.data.map((job) => {

                const remaining = Job.services.remainingDays(job);
                const status = remaining <= 0 ? "done" : "progress";

                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                };
            })

            return response.render(views + "index.ejs", { jobs: uptedJobs })
        },
        create(request, response) {

            return response.render(views + "job.ejs");

        },
        save(request, response) {
            //console.log(request.body);//temos que habilitar -> server.use(express.urlencoded({ extend: true })) em server.js

            const lastId = Job.data[Job.data.length - 1]?.id || 0;//pega o id do ultimo elemento, se não achar id será 1

            const job = request.body;
            Job.data.push({
                id: lastId + 1,
                name: request.body.name,
                "daily-hours": job["daily-hours"],
                "total-hours": job["total-hours"],
                createdAt: Date.now()
            });
            return response.redirect("/")

        },
        show(request, response) {

            const jobId = request.params.id;

            const job = Job.data.find(job => job.id == jobId);
            if (!job) {

                return response.send("Job not found");
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])




            return response.render(views + "job-edit.ejs", { job });
        },
        update(request, response) {

            const jobId = request.params.id;

            const job = Job.data.find(job => job.id == jobId);

            if (!job) {
                return response.send("Job not found")
            }
            //console.log(job);
            const updatedJob = {
                ...job,
                name: request.body.name,
                "total-hours": Number(request.body["total-hours"]),
                "daily-hours": Number(request.body["daily-hours"]),
            }

            // console.log(updatedJob.name);
            // console.log(updatedJob['total-hours']);
            // console.log(updatedJob['daily-hours']);
            Job.data = Job.data.map(job => {

                if (Number(jobId) === Number(job.id)) {
                    job = updatedJob;


                }
                return job;



            })

            return response.redirect("/job/" + jobId);
        },
        delete(request, response){

            const jobId = request.params.id;

            Job.data = Job.data.filter(job => Number(jobId) != Number(job.id));

            return response.redirect("/");

        }
    },
    services: {

        remainingDays(job) {

            const remainingDays = (job['total-hours'] / job['daily-hours']).toFixed();//toFixed arredonda números(2.49 = 2, 2.50 = 3)

            const createdDate = new Date(job.createdAt);//pega a data nos millisegundos e transforma em uma data formatada
            //dueDay-> dia de vencimento
            const dueDay = createdDate.getDate() + Number(remainingDays);//utilizo Number() porque toFixed transformou meu numero em string
            //Data de vencimento
            const dueDateInMs = createdDate.setDate(dueDay);//Data que começamos o projeto setDate(dia de vencimento)

            const timeDiffInMs = dueDateInMs - Date.now();
            //transformar millisegundos em dias
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor((timeDiffInMs / dayInMs));

            return dayDiff;

        },
        calculateBudget: (job, valueHour) => valueHour * job['total-hours']
    }
}

routes.get("/", Job.controllers.index);

routes.get("/job", Job.controllers.create);
routes.post("/job", Job.controllers.save);
routes.get("/job/:id", Job.controllers.show);
routes.post("/job/:id", Job.controllers.update);
routes.post("/job/delete/:id", Job.controllers.delete);
routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);


module.exports = routes;

