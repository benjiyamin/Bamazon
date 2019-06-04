const settings = require('../settings')


const connection = settings.connection


function getLowInventory(maxQty = 5) {
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    let query = 'SELECT p.id, p.name, (d.name) AS department_name, p.price, '
    query += 'p.stock_quantity, p.product_sales '
    query += 'FROM products p '
    query += 'INNER JOIN departments d ON p.department_id=d.id '
    query += 'WHERE p.stock_quantity <= ?;'
    let params = [maxQty]
    connection.query(query, params, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    })
  })
}


function getProduct(id) {
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    let query = 'SELECT * FROM products WHERE ?'
    let params = {
      id: id
    }
    connection.query(query, params, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response[0]);
      }
    })
  })
}


function createProduct(name, departmentId, price, stockQuantity) {
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    let query = 'INSERT INTO products SET ?'
    let params = {
      name: name,
      department_id: departmentId,
      price: price,
      stock_quantity: stockQuantity
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
  getLowInventory: getLowInventory,
  getProduct: getProduct,
  createProduct: createProduct
}