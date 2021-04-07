const sqlite3 = require('sqlite3');
const { open } = require('sqlite'); //->iremos utilizar somente a funcionalidade open

module.exports = () => open({
    filename: './database.sqlite',
    driver: sqlite3.Database
})