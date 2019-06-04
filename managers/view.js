const inquirer = require('inquirer')

//const settings = require('../settings')
const model = require('./model')
const customerModel = require('../customers/model')
const customerView = require('../customers/view')
const supervisorModel = require('../supervisors/model')


function initialize() {
  promptMenu()
}


function promptMenu() {
  const VIEW_PRODUCTS_FOR_SALE = 'View Products for Sale'
  const VIEW_LOW_INVENTORY = 'View Low Inventory'
  const ADD_TO_INVENTORY = 'Add to Inventory'
  const ADD_NEW_PRODUCT = 'Add New Product'
  const EXIT = 'Exit to Main Menu'
  const MENU_CHOICES = [
    VIEW_PRODUCTS_FOR_SALE,
    VIEW_LOW_INVENTORY,
    ADD_TO_INVENTORY,
    ADD_NEW_PRODUCT,
    EXIT
  ]
  inquirer
    .prompt([{
      type: 'list',
      name: 'menuChoice',
      message: 'Manager Action:',
      choices: MENU_CHOICES
    }])
    .then(function (answers) {
      switch (answers.menuChoice) {
        case VIEW_PRODUCTS_FOR_SALE:
          customerModel.getProducts()
            .then(function (response) {
              let products = response
              let showSales = true
              customerView.printProducts(products, showSales)
              //promptEnd()
              promptMenu()
            })
          break

        case VIEW_LOW_INVENTORY:
          model.getLowInventory()
            .then(function (response) {
              let products = response
              let showSales = true
              customerView.printProducts(products, showSales)
              //promptEnd()
              promptMenu()
            })
          break

        case ADD_TO_INVENTORY:
          customerModel.getProducts()
            .then(function (response) {
              let products = response
              promptProducts(products)
            })
          break

        case ADD_NEW_PRODUCT:
          supervisorModel.getDepartments()
            .then(function (response) {
              let departments = response
              promptNewProduct(departments)
            })
          break

        case EXIT:
          require('../index').mainMenu()
          break

        default:
          throw Error('Invalid menu choice')
      }
    })
}


function promptProducts(products) {
  customerView.printProducts(products)
  inquirer
    .prompt([{
        type: 'list',
        name: 'productName',
        message: 'Product:',
        choices: products.map(product => product.name)
      },
      {
        type: 'number',
        name: 'quantity',
        message: 'Quantity to Add to Stock:'
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
          let stockQuantity = answers.quantity
          let quantity = product.stock_quantity + stockQuantity
          customerModel.updateProduct(productId, quantity)
          console.log('Success! Inventory was updated.')
          //promptEnd()
          promptMenu()
        })
    })
}


function promptNewProduct(departments) {
  inquirer
    .prompt([{
        type: 'input',
        name: 'productName',
        message: 'Product Name:',
        validate: function (value) {
          return !!value
        }
      },
      {
        type: 'list',
        name: 'departmentName',
        message: 'Department:',
        choices: departments.map(department => department.name)
      },
      {
        type: 'number',
        name: 'price',
        message: 'Price (USD):',
        validate: function (value) {
          return !isNaN(value)
        }
      },
      {
        type: 'number',
        name: 'stockQuantity',
        message: 'Quantity to Stock:',
        validate: function (value) {
          return !isNaN(value)
        }
      },
    ])
    .then(function (answers) {
      let departmentId;
      for (let i = 0; i < departments.length; i++) {
        const department = departments[i];
        if (department.name === answers.departmentName) {
          departmentId = department.id
          break
        }
      }
      model.createProduct(
          answers.productName,
          departmentId,
          answers.price,
          answers.stockQuantity
        )
        .then(function (response) {
          console.log(response.affectedRows + " product inserted!\n");
          //promptEnd()
          promptMenu()
        })
    })
}


module.exports = {
  initialize: initialize
}