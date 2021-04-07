const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../model/Profile');


let statusCount = {

    progress: 0,
    done: 0,
    total: 0
}

module.exports = {
    async index(request, response) {

        const jobs = await Job.Get();
        const profile = await Profile.Get();
        let freeHours = 24; //iniciamos freehours com 24 horas

        statusCount.total = jobs.length;
        statusCount.done = 0;
        statusCount.progress = 0;
        const uptedJobs = jobs.map((job) => {

            const remaining = JobUtils.remainingDays(job);
            const status = remaining <= 0 ? "done" : "progress";

            statusCount[status] += 1; //somando o total de projetos finalizados e em progresso

            //se o status é em progresso diminuir a daily-hours por freeHours
            status == "progress" ? (freeHours -= Number(job['daily-hours'])) : freeHours;

            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            };
        })



        return response.render("index.ejs", { jobs: uptedJobs, profile: profile, statusCount: statusCount, freeHours })
    }


};