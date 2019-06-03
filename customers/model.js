const settings = require('../settings')


const connection = settings.connection


function getProducts() {
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    let query = 'SELECT products.id, products.name, '
    query += '(departments.name) AS department_name, products.price, '
    query += 'products.stock_quantity, products.product_sales '
    query += 'FROM products '
    query += 'LEFT JOIN departments ON products.department_id=departments.id;'
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