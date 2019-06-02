const inquirer = require('inquirer')

const bamazonCustomer = require('./bamazonCustomer')


const connection = bamazonCustomer.connection
connection.connect(function (error) {
  if (error) throw error;
  promptMenu()
})


function promptMenu() {
  const VIEW_PRODUCTS_FOR_SALE = 'View Products for Sale'
  const VIEW_LOW_INVENTORY = 'View Low Inventory'
  const ADD_TO_INVENTORY = 'Add to Inventory'
  const ADD_NEW_PRODUCT = 'Add New Product'
  const MENU_CHOICES = [
    VIEW_PRODUCTS_FOR_SALE,
    VIEW_LOW_INVENTORY,
    ADD_TO_INVENTORY,
    ADD_NEW_PRODUCT
  ]
  inquirer
    .prompt([{
      type: 'list',
      name: 'menuChoice',
      message: 'What would you like to do?',
      choices: MENU_CHOICES
    }])
    .then(function (answers) {
      switch (answers.menuChoice) {
        case VIEW_PRODUCTS_FOR_SALE:
          bamazonCustomer.getProducts()
            .then(function (response) {
              let products = response
              bamazonCustomer.printProducts(products)
              promptEnd()
            })
          break

        case VIEW_LOW_INVENTORY:
          getLowInventory()
          break

        case ADD_TO_INVENTORY:
          bamazonCustomer.getProducts()
            .then(function (response) {
              let products = response
              promptProducts(products)
            })
          break

        case ADD_NEW_PRODUCT:
          promptNewProduct()
          break

        default:
          throw Error('Invalid menu choice')
      }
    })
}


function getLowInventory(maxQty = 5) {
  let query = 'SELECT * FROM products WHERE stock_quantity <= ?'
  let params = [maxQty]
  connection.query(query, params, function (error, response) {
    if (error) throw error
    let products = response
    bamazonCustomer.printProducts(products)
    promptEnd()
  })
}


function promptProducts(products) {
  bamazonCustomer.printProducts(products)
  inquirer
    .prompt([{
        type: 'list',
        name: 'productId',
        message: 'Which product would you like to add?',
        choices: products.map(product => product.id)
      },
      {
        type: 'number',
        name: 'quantity',
        message: 'How many would you like to add?'
      },
    ])
    .then(function (answers) {
      let id = answers.productId
      let orderQuantity = answers.quantity
      addProduct(id, orderQuantity)
    })
}


function addProduct(id, stockQuantity) {
  let query = 'SELECT * FROM products WHERE ?'
  let params = {
    id: id
  }
  connection.query(query, params, function (error, response) {
    if (error) throw error
    let product = response[0]
    let quantity = product.stock_quantity + stockQuantity
    bamazonCustomer.updateProduct(id, quantity)
    console.log('Success! Inventory was updated.')
    promptEnd()
  })
}


function createProduct(productName, departmentName, price, stockQuantity) {
  let query = 'INSERT INTO products SET ?'
  let params = {
    product_name: productName,
    department_name: departmentName,
    price: price,
    stock_quantity: stockQuantity
  }
  connection.query(query, params, function (error, response) {
    if (error) throw error
    console.log(response.affectedRows + " product inserted!\n");
    promptEnd()
  })
}


function promptNewProduct() {
  inquirer
    .prompt([{
        type: 'input',
        name: 'productName',
        message: 'What is the product name?',
        validate: function (value) {
          return !!value
        }
      },
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the department name?',
        validate: function (value) {
          return !!value
        }
      },
      {
        type: 'number',
        name: 'price',
        message: 'What is the price?',
        validate: function (value) {
          return !isNaN(value)
        }
      },
      {
        type: 'number',
        name: 'stockQuantity',
        message: 'How many should be added?',
        validate: function (value) {
          return !isNaN(value)
        }
      },
    ])
    .then(function (answers) {
      createProduct(
        answers.productName,
        answers.departmentName,
        answers.price,
        answers.stockQuantity
      )
    })
}


function promptEnd() {
  inquirer
    .prompt([{
      type: 'confirm',
      name: 'startOver',
      default: true,
      message: 'Would you like to go back to the menu?'
    }])
    .then(function (answers) {
      if (answers.startOver) {
        promptMenu()
      } else {
        console.log('Thanks for stopping by! Exiting..')
        connection.end()
        process.exit()
      }
    })
}