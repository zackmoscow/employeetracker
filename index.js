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

connection.connect(function (err) {
  if (err) throw err;
  console.log("Welcome to the BootCamp Employee Tracker!")
  init();
});

function init() {
  inquirer.prompt({
    name: "choices",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add", "View", "Terminate", "Update", "Exit"],
  }).then((answer) => {
    if (answer.choices === "Add") {
      add();
    } else if (answer.choices === "View") {
      view();
    } else if (answer.choices === "Terminate") {
      terminateEmployee();
    } else if (answer.choices === "Update") {
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
    if (answer.choices === "Department") {
      addDepartment();
    } else if (answer.choices === "Role") {
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
    choices: ["Departments", "Roles", "Employees", "Employees by Manager"],
  }).then((answer) => {
    if (answer.choices === "Departments") {
      viewDepartments();
    } else if (answer.choices === "Roles") {
      viewRoles();
    } else if (answer.choices === "Employees") {
      viewEmployees();
    } else {
      viewEmployeesByManager();
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
    if (answer.choices === "Employee Role") {
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
    }, {
      name: "salary",
      type: "input",
      message: "What should the role's salary be?"
    }, {
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
    }, {
      name: "last",
      type: "input",
      message: "What is the employee's last name?"
    }, {
      name: "role",
      type: "list",
      message: "What role will the employee have?",
      choices: roles
    }, {
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

function viewDepartments() {
  const query = "SELECT * FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    let depTable = [];
    res.forEach((dep) =>
      depTable.push(
        {
          "id": dep.id,
          "name": dep.name
        })
    );
    console.log();
    console.table(depTable);
    return init();
  });
};

function viewRoles() {
  const query = "SELECT * FROM role";
  connection.query(query, (err, res) => {
    if (err) throw err;
    let roleTable = [];
    res.forEach((role) =>
      roleTable.push(
        {
          "id": role.id,
          "title": role.title,
          "salary": role.salary,
          "dep id": role.department_id
        })
    );
    console.log();
    console.table(roleTable);
    return init();
  });
};

function viewEmployees() {
  const query = `
    SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name department, role.salary, CONCAT(e2.first_name, " ", e2.last_name) manager FROM employee e1
    LEFT JOIN role ON e1.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee e2 ON e2.id = e1.manager_id;
    `
  connection.query(query, (err, res) => {
    if (err) throw err;
    let empTable = [];
    res.forEach((emp) =>
      empTable.push(
        {
          "id": emp.id,
          "first name": emp.first_name,
          "last name": emp.last_name,
          "role": emp.title,
          "salary": emp.salary,
          "manager": emp.manager
        })
    );
    console.log();
    console.table(empTable);
    return init();
  })
};

function viewEmployeesByManager() {
  const query = `
  SELECT CONCAT(e1.first_name, " ", e1.last_name) manager, e2.id, e2.first_name, e2.last_name, role.title, department.name department, role.salary FROM employee e2
  INNER JOIN employee e1 ON e1.id = e2.manager_id
  LEFT JOIN role ON e2.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  ORDER BY manager ASC;
  `
  connection.query(query, (err, res) => {
    if (err) throw err;
    let empTable = [];
    res.forEach((emp) =>
      empTable.push(
        {
          "id": emp.id,
          "first name": emp.first_name,
          "last name": emp.last_name,
          "role": emp.title,
          "salary": emp.salary,
          "manager": emp.manager
        })
    );
    console.log();
    console.table(empTable);
    return init();
  })
};

function terminateEmployee() {
  const empQuery = "SELECT * FROM employee";
  let employees = [];
  connection.query(empQuery, (error, result) => {
    if (error) throw error;
    for (i = 0; i < result.length; i++) {
      employees.push(result[i].first_name + " " + result[i].last_name);
    };
    inquirer.prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee do you want to fire",
        choices: employees
      },
    ]).then((answer) => {
      const empQuery = `SELECT * FROM employee WHERE CONCAT (first_name, " ", last_name) = "${answer.employee}"`;
      connection.query(empQuery, (err, res) => {
        if (err) throw err;
        let empID = parseInt(res[0].id);

        const query = `DELETE FROM employee WHERE id = ${empID}`;
        connection.query(query, (e, r) => {
          if (e) throw e;
          return init();
        });
      });
    });
  });
};
  
function updateRole() {
  const empQuery = "SELECT * FROM employee";
  let employees = [];
  connection.query(empQuery, (error, result) => {
    if (error) throw error;
    for (i = 0; i < result.length; i++) {
      employees.push(result[i].first_name + " " + result[i].last_name);
    };

    const roleQuery = "SELECT * FROM role";
    let roles = [];
    connection.query(roleQuery, (err, res) => {
      if (err) throw err;
      for (i = 0; i < res.length; i++) {
        roles.push(res[i].title);
      };

      inquirer.prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee do you want to edit?",
          choices: employees
        }, {
          name: "role",
          type: "list",
          message: "What new role will the employee have?",
          choices: roles
        },

      ]).then((answer) => {
        const roleQuery = `SELECT * FROM role WHERE title = "${answer.role}"`;
        connection.query(roleQuery, (error, result) => {
          if (error) throw error;
          let roleID = parseInt(result[0].id);

          const empQuery = `SELECT * FROM employee WHERE CONCAT (first_name, " ", last_name) = "${answer.employee}"`;
          connection.query(empQuery, (err, res) => {
            if (err) throw err;
            let empID = parseInt(res[0].id);

            const query = `UPDATE employee SET role_id = ${roleID} WHERE id = ${empID}`;
            connection.query(query, (e, r) => {
              if (e) throw e;
              return init();
            });
          });
        });
      });
    });
  });
};

function updateManager() {
    const employeeQuery = "SELECT * FROM employee";
    let employees = [];
    connection.query(employeeQuery, (error, result) => {
      if (error) throw error;
      for (i = 0; i < result.length; i++) {
        employees.push(result[i].first_name + " " + result[i].last_name);
      };

      const managerQuery = "SELECT * FROM employee";
      let managers = [];
      connection.query(managerQuery, (err, res) => {
        if (err) throw err
        for (i = 0; i < res.length; i++) {
          managers.push(res[i].first_name + " " + res[i].last_name);
        }

        inquirer.prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee do you want to edit?",
            choices: employees
          }, {
            name: "manager",
            type: "list",
            message: "Who should be the employee's new manager?",
            choices: managers
          },

        ]).then((answer) => {
          const mgrQuery = `SELECT * FROM employee WHERE CONCAT (first_name, " ", last_name) = "${answer.manager}"`;
          connection.query(mgrQuery, (error, result) => {
            if (error) throw error;
            let mgrID = parseInt(result[0].id);

            const empQuery = `SELECT * FROM employee WHERE CONCAT (first_name, " ", last_name) = "${answer.employee}"`;
            connection.query(empQuery, (err, res) => {
              if (err) throw err;
              let empID = parseInt(res[0].id);

              const query = `UPDATE employee SET manager_id = ${mgrID} WHERE id = ${empID}`;
              connection.query(query, (e, r) => {
                if (e) throw e;
                return init();
              });
            });
          });
        });
      });
    });
  
};
