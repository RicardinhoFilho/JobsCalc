const Profile = require('../model/Profile');

module.exports = {
    async index(request, response) {
        return response.render("profile.ejs", { profile: await Profile.Get() })
    },
    async update(request, response) {
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

        Profile.update({

            ...await Profile.Get(),
            ...request.body,
            "value-hour": valueHour

        });

        return response.redirect('/profile');
    }
}