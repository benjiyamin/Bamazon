const inquirer = require('inquirer')

const bamazonCustomer = require('./bamazonCustomer')
const bamazonSupervisor = require('./bamazonSupervisor')


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
      message: 'Manager Action:',
      choices: MENU_CHOICES
    }])
    .then(function (answers) {
      switch (answers.menuChoice) {
        case VIEW_PRODUCTS_FOR_SALE:
          bamazonCustomer.getProducts()
            .then(function (response) {
              let products = response
              let showSales = true
              bamazonCustomer.printProducts(products, showSales)
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
          bamazonSupervisor.getDepartments()
            .then(function (response) {
              let departments = response
              promptNewProduct(departments)
            })
          break

        default:
          throw Error('Invalid menu choice')
      }
    })
}


function getLowInventory(maxQty = 5) {
  let query = 'SELECT products.id, products.name, '
  query += 'departments.name, products.price, '
  query += 'products.stock_quantity, products.product_sales '
  query += 'FROM products '
  query += 'INNER JOIN departments ON products.department_id=departments.id '
  query += 'WHERE products.stock_quantity <= ?;'
  let params = [maxQty]
  connection.query(query, params, function (error, response) {
    if (error) throw error
    let products = response
    let showSales = true
    bamazonCustomer.printProducts(products, showSales)
    promptEnd()
  })
}


function promptProducts(products) {
  bamazonCustomer.printProducts(products)
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
      let orderQuantity = answers.quantity
      addProduct(productId, orderQuantity)
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


function createProduct(name, departmentId, price, stockQuantity) {
  let query = 'INSERT INTO products SET ?'
  let params = {
    name: name,
    department_id: departmentId,
    price: price,
    stock_quantity: stockQuantity
  }
  connection.query(query, params, function (error, response) {
    if (error) throw error
    console.log(response.affectedRows + " product inserted!\n");
    promptEnd()
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
        message: 'Price:',
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
      createProduct(
        answers.productName,
        departmentId,
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