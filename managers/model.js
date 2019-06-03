const settings = require('../settings')


const connection = settings.connection


function getLowInventory(maxQty = 5) {
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    let query = 'SELECT products.id, products.name, '
    query += '(departments.name) AS department_name, products.price, '
    query += 'products.stock_quantity, products.product_sales '
    query += 'FROM products '
    query += 'INNER JOIN departments ON products.department_id=departments.id '
    query += 'WHERE products.stock_quantity <= ?;'
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