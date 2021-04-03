const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../model/Profile');

module.exports = {

    //ajustes no job
    //calculo d etempo restante
    index(request, response) {

        const jobs = Job.get();
        const profile = Profile.get();

        const uptedJobs = jobs.map((job) => {

            const remaining = JobUtils.remainingDays(job);
            const status = remaining <= 0 ? "done" : "progress";

            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            };
        })

        return response.render("index.ejs", { jobs: uptedJobs })
    },
    create(request, response) {

        return response.render("job.ejs");

    },
    save(request, response) {
        //console.log(request.body);//temos que habilitar -> server.use(express.urlencoded({ extend: true })) em server.js
        const jobs = Job.get();

        const lastId = jobs[jobs.length - 1]?.id || 0;//pega o id do ultimo elemento, se não achar id será 1

        const job = request.body;
        jobs.push({
            id: lastId + 1,
            name: request.body.name,
            "daily-hours": job["daily-hours"],
            "total-hours": job["total-hours"],
            createdAt: Date.now()
        });

        return response.redirect("/")

    },
    show(request, response) {

        const jobs = Job.get();
        const profile = Profile.get();

        const jobId = request.params.id;

        const job = jobs.find(job => job.id == jobId);
        if (!job) {

            return response.send("Job not found");
        }

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);




        return response.render("job-edit.ejs", { job });
    },
    update(request, response) {

        const jobs = Job.get();
        const jobId = request.params.id;

        const job = jobs.find(job => job.id == jobId);

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
        const newJobs = jobs.map(job => {

            if (Number(jobId) === Number(job.id)) {
                job = updatedJob;


            }
            return job;

        })

        Job.update(newJobs);

        return response.redirect("/job/" + jobId);
    },
    delete(request, response) {

        const jobId = request.params.id;
        
        Job.delete(jobId);

        

        return response.redirect("/");

    },
    calculateBudget: (job, valueHour) => valueHour * job['total-hours']
}
