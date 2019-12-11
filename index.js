const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  init();
});

function init() {
    console.log("Welcome to the BootCamp Employee Tracker!")
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: ["Add", "View", "Delete", "Update", "Exit"],
    }).then((answer) => {
        if (answer.choices == "Add") {
          add();
        } else if (answer.choices == "View") {
          view();
        } else if (answer.choices == "Delete") {
          del();
        } else if (answer.choices == "Update") {
          update();
        } else {
          console.log("Goodbye!")
          return process.exit(0);
        }
    });
};

function add() {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "What would you like to add?",
        choices: ["Department", "Role", "Employee"],
    }).then((answer) => {
        if (answer.choices == "Department") {
          addDepartment();
        } else if (answer.choices == "Role") {
          addRole();
        } else {
          addEmployee();
        }
    });
};

function view() {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "What would you like to view?",
        choices: ["Departments", "Roles", "Employees"],
    }).then((answer) => {
        if (answer.choices == "Departments") {
          viewDepartments();
        } else if (answer.choices == "Roles") {
          viewRoles();
        } else {
          viewEmployees();
        }
    });
};

function del() {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "What would you like to delete?",
        choices: ["Department", "Role", "Employee"],
    }).then((answer) => {
        if (answer.choices == "Department") {
          delDepartment();
        } else if (answer.choices == "Role") {
          delRole();
        } else {
          delEmployee();
        }
    });
};

function update() {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "What would you like to update?",
        choices: ["Employee Role", "Employee Manager"],
    }).then((answer) => {
        if (answer.choices == "Employee Role") {
          updateRole();
        } else {
          updateManager();
        }
    });
};
