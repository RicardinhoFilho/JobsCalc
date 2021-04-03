module.exports = {

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

        //restam x dias
        return dayDiff;

    },
    calculateBudget(job, valueHour)
    {
      return valueHour * job['total-hours']
    }
}