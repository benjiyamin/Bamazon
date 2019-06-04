const settings = require('../settings')


const connection = settings.connection


function getDepartments() {
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    let query = 'SELECT d.id, d.name, d.overhead_costs, '
    query += 'COALESCE(SUM(p.product_sales),0) AS product_sales '
    query += 'FROM departments d '
    query += 'LEFT JOIN products p ON d.id=p.department_id '
    query += 'GROUP BY IFNULL(p.department_id, d.id);'
    connection.query(query, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    })
  })
}


function createDepartment(name, overheadCosts) {
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    let query = 'INSERT INTO departments SET ?'
    let params = {
      name: name,
      overhead_costs: overheadCosts
    }
    connection.query(query, params, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    })
  })
}


module.exports = {
  getDepartments: getDepartments,
  createDepartment: createDepartment,
}