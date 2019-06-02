const mysql = require('mysql')
const inquirer = require('inquirer')
const Table = require('cli-table3')

const keys = require('./keys.js')


let connection = mysql.createConnection({
  user: keys.mysql.username,
  password: keys.mysql.password,
  database: 'bamazon'
})


function formatUSD(amount) {
  return `$ ${amount.toFixed(2)}`
}


// When node executes script
if (!module.parent) {
  connection.connect(function (error) {
    if (error) throw error;
    getProducts()
      .then(function (response) {
        let products = response
        printProducts(products)
        promptProducts(products)
      })
  })
}


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


function printProducts(products, showSales = false) {
  let head = [
    'ID',
    'Product Name',
    'Department Name',
    'Price',
    'Stock Quantity'
  ]
  if (showSales) head.push('Product Sales')
  let table = new Table({
    head: head
  })
  products.forEach(product => {
    let row = [
      product.id,
      product.name,
      product.department_name,
      {
        hAlign: 'right',
        content: formatUSD(product.price)
      },
      product.stock_quantity
    ]
    if (showSales) {
      row.push({
        hAlign: 'right',
        content: formatUSD(product.product_sales)
      })
    }
    table.push(row)
  })
  console.log(table.toString())
}


function promptProducts(products) {
  inquirer
    .prompt([{
        type: 'list',
        name: 'productName',
        message: 'Which product would you like to buy?',
        choices: products.map(product => product.name)
      },
      {
        type: 'number',
        name: 'quantity',
        message: 'How many would you like to buy?'
      },
    ])
    .then(function (answers) {
      let productId;
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.name === answers.productName) {
          productId = product.id
          break
        }
      }
      let orderQuantity = answers.quantity
      buyProduct(productId, orderQuantity)
    })
}


function buyProduct(id, orderQuantity) {
  let query = 'SELECT * FROM products WHERE ?'
  let params = {
    id: id
  }
  connection.query(query, params, function (error, response) {
    if (error) throw error
    let product = response[0]
    if (orderQuantity <= product.stock_quantity) {
      let quantity = product.stock_quantity - orderQuantity
      let sales = orderQuantity * product.price
      let productSales = product.product_sales + sales
      updateProduct(id, quantity, productSales)
      printOrder(product, orderQuantity)
    } else {
      console.log('Insufficient quantity! Try again.')
      getProducts()
    }
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


/*
function deleteProduct(id) {
  let query = 'DELETE FROM products WHERE ?'
  let params = {
    id: id
  }
  connection.query(query, params, function (error, response) {
    if (error) throw error
    return response[0]
  })
}
*/


function printOrder(product, quantity) {
  console.log('Success! Thank you for your order. View details below.')
  let table = new Table({
    head: [
      'Qty',
      'Description',
      'Unit Price',
      'Amount',
    ]
  })
  table.push([
    quantity,
    product.name,
    formatUSD(product.price),
    formatUSD(product.price * quantity) // Total Price
  ])
  console.log(table.toString())
  promptEnd()
}


function promptEnd() {
  inquirer
    .prompt([{
      type: 'confirm',
      name: 'startOver',
      default: true,
      message: 'Would you like to make another order?'
    }])
    .then(function (answers) {
      if (answers.startOver) {
        getProducts()
          .then(function (response) {
            let products = response
            printProducts(products)
            promptProducts(products)
          })
      } else {
        console.log('Thanks for stopping by! Exiting..')
        connection.end()
        process.exit()
      }
    })
}


module.exports = {
  connection: connection,
  formatUSD: formatUSD,
  getProducts: getProducts,
  printProducts: printProducts,
  updateProduct: updateProduct
}