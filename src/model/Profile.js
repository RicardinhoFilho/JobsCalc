const Database = require('../db/config');


module.exports = {

    async Get() {

        const db = await Database();

        data = await db.get(`SELECT * FROM profile`);
        //console.log(data2)
        await db.close();

        return {

            name: data.name,
            avatar: data.avatar,
            "monthly-budget": data.monthly_budget,
            "days-per-week": data.days_per_week,
            "hours-per-day": data.hours_per_day,
            "vacation-per-year": data.vacation_per_year,
            "value-hour": data.value_hour

        };
    },

    async update(newData) {

        const db = await Database();

        await db.run(`UPDATE profile SET 
        name = "${newData.name}", 
        avatar = "${newData.avatar}", 
        monthly_budget =  ${newData["monthly-budget"]},
        days_per_week =  ${newData["days-per-week"]},
        hours_per_day =  ${newData["hours-per-day"]},
        vacation_per_year =  ${newData["vacation-per-year"]},
        value_hour =  ${newData["value-hour"]} `)

        await db.close();
        data = newData;
    }
}