const inquirer = require('inquirer')

const customerView = require('./customers/view')
const managerView = require('./managers/view')
const supervisorView = require('./supervisors/view')


const VIEW_CUSTOMER = 'Customer'
const VIEW_MANAGER = 'Manager'
const VIEW_SUPERVISOR = 'Supervisor'

const MENU_CHOICES = [
  VIEW_CUSTOMER,
  VIEW_MANAGER,
  VIEW_SUPERVISOR
]


inquirer
  .prompt([{
    type: 'list',
    name: 'menuChoice',
    message: 'Main Menu',
    choices: MENU_CHOICES
  }])
  .then(function (answers) {
    switch (answers.menuChoice) {
      case VIEW_CUSTOMER:
        customerView.initialize()
        break
      
      case VIEW_MANAGER:
        managerView.initialize()
        break

      case VIEW_SUPERVISOR:
        supervisorView.initialize()
        break

      default:
        throw Error('Invalid menu choice')
    }
  })