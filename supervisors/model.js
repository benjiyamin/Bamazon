const settings = require('../settings')


const connection = settings.connection


function getDepartments() {
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    let query = 'SELECT departments.id, departments.name, '
    query += 'departments.overhead_costs, '
    query += 'COALESCE(SUM(products.product_sales),0) AS product_sales '
    query += 'FROM departments '
    query += 'LEFT JOIN products ON departments.id=products.department_id '
    query += 'GROUP BY products.department_id;'
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