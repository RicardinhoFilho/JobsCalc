let data = [
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
]

module.exports = {

    get() {
        return data;
    },
    update(newJob) {

        data = newJob;
    },
    delete(jobId) {

        data = data.filter(job => Number(jobId) != Number(job.id));
    }
}