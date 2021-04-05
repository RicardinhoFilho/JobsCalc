const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../model/Profile');


let statusCount = {

    progress:0,
    done:0,
    total:0
}

module.exports = {
    index(request, response) {

        const jobs = Job.get();
        const profile = Profile.get();
        let freeHours = 0;
        
        statusCount.total = jobs.length;
        statusCount.done = 0;
        statusCount.progress = 0;
        const uptedJobs = jobs.map((job) => {

            const remaining = JobUtils.remainingDays(job);
            const status = remaining <= 0 ? "done" : "progress";

            statusCount[status]+= 1;//somando o total de projetos finalizados e em progresso
            

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