const mysql = require('mysql')

const keys = require('./keys.js')


let connection = mysql.createConnection({
  user: keys.mysql.username,
  password: keys.mysql.password,
  database: 'bamazon'
})


function formatUSD(amount) {
  return `$ ${amount.toFixed(2)}`
}


module.exports = {
  connection: connection,
  formatUSD: formatUSD
}