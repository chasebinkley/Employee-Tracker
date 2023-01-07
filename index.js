const inquirer = require("inquirer");
const connection = require("./db/connection");

function questionsPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message:
          "WELCOME TO THE EMPLOYEE TRACKER // What would you like to do?",
        choices: [
          {
            name: "view all employees",
            value: "VIEW_EMPLOYEES",
          },
          {
            name: "view all the departments",
            value: "VIEW_DEPARTMENTS",
          },
          {
            name: "view all roles",
            value: "VIEW_ROLE",
          },
          {
            name: "add an employee",
            value: "ADD_EMPLOYEE",
          },
          {
            name: "add a department",
            value: "ADD_DEPARTMENT",
          },
          {
            name: "add a role",
            value: "ADD_ROLE",
          },
          {
            name: "update an employee role?",
            value: "UPDATE_EMPLOYEE_ROLE",
          },
          {
            name: "Quit",
            value: "QUIT",
          },
        ],
      },
    ])
 
    .then((res) => {
      let choice = res.choice;
      switch (choice) {
        case "VIEW_EMPLOYEES":
          viewEmployees();
          break;
        case "VIEW_DEPARTMENTS":
          viewDepartments();
          break;
        case "VIEW_ROLE":
          viewRole();
          break;
        case "ADD_EMPLOYEE":
          addEmployee();
          break;
        case "UPDATE_EMPLOYEE_ROLE":
          updateEmployeeRole();
          break;
        case "ADD_DEPARTMENT":
          addDepartment();
          break;
        case "ADD_ROLE":
          addRole();
          break;
        case "QUIT":
          quit();
      }
    });
}


function viewEmployees() {
  connection.query("select * from employee", (err, res) => {
    if (err) throw err;
    console.table(res);
    questionsPrompt();
  });
}

function viewDepartments() {
  connection.query("select * from department", (err, res) => {
    if (err) throw err;
    console.table(res);
    questionsPrompt();
  });
}

function viewRole() {
  connection.query("select * from role", (err, res) => {
    if (err) throw err;
    console.table(res);
    questionsPrompt();
  });
}

function addEmployee() {
  connection.query("select * from role", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the new employee's first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the new employee's last name?",
        },
        {
          type: "list",
          name: "title",
          message: "What is the new employee's role",
          choices: res.map((role) => role.title),
        },
      ])
      .then((data) => {
        let role = res.find((role) => role.title === data.title);
        connection.query("insert into employee set ?", {
          first_name: data.firstName,
          last_name: data.lastName,
          role_id: role.id,
        });
        questionsPrompt();
      });
  });
}

function addDepartment() {
  connection.query("select * from department", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "departmentName",
          message: "What Department would you like to add?",
        },
      ])
      .then((data) => {
        connection.query("insert into department set ?", {
          name: data.departmentName,
        });
        console.log(`added ${data.departmentName} to list of departments`);

        questionsPrompt();
      });
  });
}

function addRole() {
  connection.query("select * from department", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of this role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of this role?",
        },
        {
          type: "list",
          name: "name",
          message: "What department is this role in?",
          choices: res.map((department) => department.name),
        },
      ])
      .then((data) => {
        let department = res.find(
          (department) => department.name === data.name
        );
        connection.query("insert into role set ?", {
          title: data.title,
          salary: data.salary,
          department_id: department.id,
        });
        console.log(`added ${data.title} to list of roles`);

        questionsPrompt();
      });
  });
}

function updateEmployeeRole() {
  connection.query("select * from employee", (err, employeeData) => {
    if (err) throw err;
    connection.query("select * from role", (err, roleData) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Who is the employee you want to update?",
            choices: employeeData.map((employee) => {
              return {
                name: employee.first_name + " " + employee.last_name,
                value: employee.id,
              };
            }),
          },
          {
            type: "list",
            name: "role",
            message: "What is the role you want to update?",
            choices: roleData.map((role) => {
              return { name: role.title, value: role.id };
            }),
          },
        ])
        .then((userAnswers) => {
          connection.query(
            "update employee set role_id = ? where id = ?",
            [userAnswers.role, userAnswers.employee],
            (err, roleData) => {
              console.log("user updated!");
              questionsPrompt();
            }
          );
        });
    });
  });
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}

questionsPrompt();
