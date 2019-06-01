require('dotenv').config()

exports.mysql = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
}