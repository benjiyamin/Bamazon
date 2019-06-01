const mysql = require('mysql')
const inquirer = require('inquirer')
const Table = require('cli-table3')

const keys = require('./keys.js')


let connection = mysql.createConnection({
  user: keys.mysql.username,
  password: keys.mysql.password,
  database: 'bamazon'
})


connection.connect(function (error) {
  if (error) throw error;
  getProducts()
})


function getProducts() {
  let query = 'SELECT * FROM products'
  connection.query(query, function (error, response) {
    if (error) throw error
    let products = response
    printProducts(products)
  })
}


function printProducts(products) {
  let table = new Table({
    head: [
      'ID',
      'Product Name',
      'Department Name',
      'Price',
      'Stock Quantity'
    ]
  })
  products.forEach(product => {
    table.push([
      product.id,
      product.product_name,
      product.department_name,
      product.price.toFixed(2),
      product.stock_quantity
    ])
  })
  console.log(table.toString())
  promptProducts(products)
}


function promptProducts(products) {
  inquirer
    .prompt([{
        type: 'list',
        name: 'productId',
        message: 'Which product would you like to buy?',
        choices: products.map(product => product.id)
      },
      {
        type: 'number',
        name: 'quantity',
        message: 'How many would you like to buy?'
      },
    ])
    .then(function (answers) {
      let id = answers.productId
      let orderQuantity = answers.quantity
      buyProduct(id, orderQuantity)
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
    if (orderQuantity < product.stock_quantity) {
      let quantity = product.stock_quantity - orderQuantity
      updateProduct(id, quantity)
      printOrder(product, orderQuantity)
    } else if (orderQuantity === product.stock_quantity) {
      deleteProduct(id)
      printOrder(product, orderQuantity)
    } else {
      console.log('Insufficient quantity! Try again.')
      getProducts()
    }
  })
}


function updateProduct(id, quantity) {
  let query = 'UPDATE products SET ? WHERE ?'
  let params = [{
      stock_quantity: quantity
    },
    {
      id: id
    }
  ]
  connection.query(query, params, function (error, response) {
    if (error) throw error
    return response[0]
  })
}


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
    product.product_name,
    `$ ${product.price.toFixed(2)}`,
    `$ ${(product.price * quantity).toFixed(2)}`
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
      } else {
        console.log('Thanks for stopping by! Exiting..')
        process.exit()
      }
    })
}