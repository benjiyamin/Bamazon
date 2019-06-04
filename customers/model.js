const settings = require('../settings')


const connection = settings.connection


function getProducts() {
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    let query = 'SELECT p.id, p.name, (d.name) AS department_name, p.price, '
    query += 'p.stock_quantity, p.product_sales '
    query += 'FROM products p '
    query += 'LEFT JOIN departments d ON p.department_id=d.id;'
    connection.query(query, function (error, response) {
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


function updateProduct(id, quantity, productSales) {
  let query = 'UPDATE products SET ? WHERE ?'
  let params = [{
      stock_quantity: quantity
    },
    {
      id: id
    }
  ]
  if (productSales) {
    params[0].product_sales = productSales
  }
  connection.query(query, params, function (error, response) {
    if (error) throw error
    return response[0]
  })
}


module.exports = {
  getProducts: getProducts,
  getProduct: getProduct,
  updateProduct: updateProduct
}