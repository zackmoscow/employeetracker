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
  console.log("Welcome to the BootCamp Employee Tracker!")
  init();
});

function init() {
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

function addDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What department would you like to add?"
    }).then((answer) => {
        const query = `INSERT INTO department (name) VALUES ("${answer.department}")`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            return init();
        });
    });
};

function addRole() {
    const query = "SELECT * FROM department";
    let departments = [];
    connection.query(query, (err, res) => {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
              departments.push(res[i].name);
        };
    });
    inquirer.prompt([
    {
        name: "role",
        type: "input",
        message: "What role would you like to add?"
    },{
        name: "salary",
        type: "input",
        message: "What should the role's salary be?"
    },{
        name: "department",
        type: "list",
        message: "What department does the role belong to?",
        choices: departments
    }
    ]).then((answer) => {
        const depQuery = `SELECT * FROM department WHERE name = "${answer.department}"`;
        connection.query(depQuery, (error, result) => {
            if (error) throw error;
            let depID = parseInt(result[0].id);

            const query = `INSERT INTO role (title, salary, department_id) VALUES ("${answer.role}", "${parseInt(answer.salary)}", "${depID}")`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                return init();
            });
        });
    });
};

function addEmployee() {
    const roleQuery = "SELECT * FROM role";
    let roles = [];
    connection.query(roleQuery, (error, result) => {
        if (error) throw error;
        for (i = 0; i < result.length; i++) {
          roles.push(result[i].title);
        };
    });
    const managerQuery = "SELECT * FROM employee";
    let managers = [];
    connection.query(managerQuery, (err, res) => {
        if (err) throw err
        for (i = 0; i < res.length; i++) {
          managers.push(res[i].first_name + " " + res[i].last_name);
        }
    });
    inquirer.prompt([
    {
        name: "first",
        type: "input",
        message: "What is the employee's first name?"
    },{
        name: "last",
        type: "input",
        message: "What is the employee's last name?"
    },{
        name: "role",
        type: "list",
        message: "What role will the employee have?",
        choices: roles
    },{
        name: "manager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: managers
    }
    ]).then((answer) => {
      const roleQuery = `SELECT * FROM role WHERE title = "${answer.role}"`;
      connection.query(roleQuery, (error, result) => {
          if (error) throw error;
          let roleID = parseInt(result[0].id);

          const mgrQuery = `SELECT * FROM employee WHERE CONCAT (first_name, " ", last_name) = "${answer.manager}"`;
          connection.query(mgrQuery, (err, res) => {
              if (err) throw err;
              let mgrID = parseInt(res[0].id);

              const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.first}", "${answer.last}", "${roleID}", "${mgrID}")`;
              connection.query(query, (e, r) => {
                if (e) throw e;
                return init();
              });
          });
      });
    });
};
