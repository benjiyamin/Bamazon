const mysql = require('mysql')

const keys = require('./keys.js')


let connection = mysql.createConnection({
  user: keys.mysql.username,
  password: keys.mysql.password,
  database: 'bamazon'
})


module.exports = {
  connection: connection
}