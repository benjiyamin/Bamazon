const inquirer = require('inquirer')
const Table = require('cli-table3')

const bamazonCustomer = require('./bamazonCustomer')
const formatUSD = bamazonCustomer.formatUSD


const connection = bamazonCustomer.connection
// When node executes script
if (!module.parent) {
  connection.connect(function (error) {
    if (error) throw error;
    promptMenu()
  })
}


function promptMenu() {
  const VIEW_PRODUCTS_SALES_BY_DEPARTMENT = 'View Product Sales by Department'
  const CREATE_NEW_DEPARTMENT = 'Create New Department'
  const MENU_CHOICES = [
    VIEW_PRODUCTS_SALES_BY_DEPARTMENT,
    CREATE_NEW_DEPARTMENT
  ]
  inquirer
    .prompt([{
      type: 'list',
      name: 'menuChoice',
      message: 'Supervisor Action:',
      choices: MENU_CHOICES
    }])
    .then(function (answers) {
      switch (answers.menuChoice) {
        case VIEW_PRODUCTS_SALES_BY_DEPARTMENT:
          getDepartments()
            .then(function (response) {
              let products = response
              printDepartments(products)
              promptEnd()
            })
          break

        case CREATE_NEW_DEPARTMENT:
          promptNewDepartment()
          break

        default:
          throw Error('Invalid menu choice')
      }
    })
}


function getDepartments() {
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    let query = 'SELECT departments.id, departments.name, '
    query += 'departments.overhead_costs, '
    query += 'SUM(products.product_sales) AS product_sales '
    query += 'FROM departments '
    query += 'LEFT JOIN products ON departments.id=products.department_id '
    query += 'GROUP BY products.department_id;'
    connection.query(query, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    })
  })
}


function printDepartments(departments) {
  let table = new Table({
    head: [
      'ID',
      'Department Name',
      'Overhead Costs',
      'Product Sales',
      'Total Profit'
    ]
  })
  departments.forEach(department => {

    table.push([
      department.id,
      department.name,
      {
        hAlign: 'right',
        content: formatUSD(department.overhead_costs)
      },
      {
        hAlign: 'right',
        content: formatUSD(department.product_sales)
      },
      {
        hAlign: 'right',
        content: formatUSD(department.product_sales - department.overhead_costs) // Total Profit
      },
    ])
  })
  console.log(table.toString())
}


function createDepartment(name, overheadCosts) {
  let query = 'INSERT INTO departments SET ?'
  let params = {
    name: name,
    overhead_costs: overheadCosts
  }
  connection.query(query, params, function (error, response) {
    if (error) throw error
    console.log(response.affectedRows + " departments inserted!\n");
    promptEnd()
  })
}


function promptNewDepartment() {
  inquirer
    .prompt([{
        type: 'input',
        name: 'departmentName',
        message: 'Department Name:',
        validate: function (value) {
          return !!value
        }
      },
      {
        type: 'number',
        name: 'overheadCosts',
        message: 'Overhead Costs:',
        validate: function (value) {
          return !isNaN(value)
        }
      }
    ])
    .then(function (answers) {
      createDepartment(
        answers.departmentName,
        answers.overheadCosts
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


module.exports = {
  getDepartments: getDepartments
}