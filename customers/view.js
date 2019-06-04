const inquirer = require('inquirer')
const Table = require('cli-table3')

const model = require('./model')
const formatUSD = require('../formatUSD')


function initialize() {
  model.getProducts()
    .then(function (response) {
      let products = response
      printProducts(products)
      promptProducts(products)
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
  console.log(table.toString() + '\n')
}


function promptProducts(products) {
  inquirer
    .prompt([{
        type: 'list',
        name: 'productName',
        message: 'Select a product to buy:',
        choices: products.map(product => product.name)
      },
      {
        type: 'number',
        name: 'quantity',
        message: 'Quantity:',
        validate: function (value) {
          return !isNaN(value)
        }
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
      model.getProduct(productId)
        .then(function (response) {
          let product = response
          let orderQuantity = answers.quantity
          buyProduct(product, orderQuantity)
        })
    })
}


function buyProduct(product, orderQuantity) {
  if (orderQuantity <= product.stock_quantity) {
    let quantity = product.stock_quantity - orderQuantity
    let sales = orderQuantity * product.price
    let productSales = product.product_sales + sales
    model.updateProduct(product.id, quantity, productSales)
    printOrder(product, orderQuantity)
  } else {
    console.log('Insufficient quantity! Try again. \n')
    model.getProducts()
      .then(function (response) {
        let products = response
        printProducts(products)
        promptProducts(products)
      })
  }
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
    product.name,
    formatUSD(product.price),
    formatUSD(product.price * quantity) // Total Price
  ])
  console.log(table.toString() + '\n')
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
        model.getProducts()
          .then(function (response) {
            let products = response
            printProducts(products)
            promptProducts(products)
          })
      } else {
        //console.log('Thanks for stopping by! Exiting..')
        //settings.connection.end()
        //process.exit()
        require('../index').mainMenu()
      }
    })
}


module.exports = {
  initialize: initialize,
  printProducts: printProducts
}