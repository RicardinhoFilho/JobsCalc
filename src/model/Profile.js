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
            "days_per_week": data.days_per_week,
            "hours-per-day": data.hours_per_day,
            "vacation_per_year": data.vacation_per_year,
            "value-hour": data.value_hour

        };
    },

    update(newData) {
        data = newData;
    }
}