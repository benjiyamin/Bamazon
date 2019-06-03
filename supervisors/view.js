const inquirer = require('inquirer')
const Table = require('cli-table3')

const model = require('./model')
const formatUSD = require('../formatUSD')


function initialize() {
  promptMenu()
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
          model.getDepartments()
            .then(function (response) {
              let products = response
              printDepartments(products)
              //promptEnd()
              promptMenu()
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
    console.log(department.overhead_costs, department.product_sales)
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
      model.createDepartment(
          answers.departmentName,
          answers.overheadCosts
        )
        .then(function (response) {
          console.log(response.affectedRows + " departments inserted!\n");
          //promptEnd()
          promptMenu()
        })
    })
}


module.exports = {
  initialize: initialize
}