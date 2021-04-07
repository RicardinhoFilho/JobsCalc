const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../model/Profile');

module.exports = {

    //ajustes no job
    //calculo d etempo restante

    create(request, response) {

        return response.render("job.ejs");

    },
    async save(request, response) {
        //console.log(request.body);//temos que habilitar -> server.use(express.urlencoded({ extend: true })) em server.js
        const jobs = await Job.Get();

        const job = request.body;
        await Job.create({

            name: request.body.name,
            "daily-hours": job["daily-hours"],
            "total-hours": job["total-hours"],
            createdAt: Date.now()
        });

        return response.redirect("/")

    },
    async show(request, response) {

        const jobs = await Job.Get();
        const profile = await Profile.Get();

        const jobId = request.params.id;

        const job = jobs.find(job => job.id == jobId);
        if (!job) {

            return response.send("Job not found");
        }

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

        return response.render("job-edit.ejs", { job });
    },
    async update(request, response) {

        const jobId = request.params.id;

        const updatedJob = {
            name: request.body.name,
            "total-hours": Number(request.body["total-hours"]),
            "daily-hours": Number(request.body["daily-hours"]),
        }


        await Job.update(updatedJob, jobId);

        return response.redirect("/job/" + jobId);
    },
    async delete(request, response) {

        const jobId = request.params.id;

        await Job.delete(jobId);

        return response.redirect("/");

    }
}