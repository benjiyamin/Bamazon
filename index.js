const inquirer = require('inquirer')

const settings = require('./settings')
const customerView = require('./customers/view')
const managerView = require('./managers/view')
const supervisorView = require('./supervisors/view')


const VIEW_CUSTOMER = 'Customer View'
const VIEW_MANAGER = 'Manager View'
const VIEW_SUPERVISOR = 'Supervisor View'
const EXIT = 'Exit Bamazon'

const MENU_CHOICES = [
  VIEW_CUSTOMER,
  VIEW_MANAGER,
  VIEW_SUPERVISOR,
  EXIT
]


function mainMenu() {
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

        case EXIT:
          console.log('Thanks for stopping by! Exiting.. \n')
          settings.connection.end()
          process.exit()
          break

        default:
          throw Error('Invalid menu choice')
      }
    })
}


// When node executes script
if (!module.parent) {
  mainMenu()
}


module.exports = {
  mainMenu: mainMenu
}