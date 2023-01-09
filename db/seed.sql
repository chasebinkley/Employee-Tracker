USE employees;

INSERT INTO department(name)

VALUES ("libations"), ("cuisine service"), ("rubbish removal");

INSERT INTO role(title, salary, department_id)

VALUES ("bartender", 50000, 1), ("waiter", 40000, 2), ("busser", 20000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)

VALUES ("Theodore", "Cunningham", 1, 1), ("Chet", "Francis", 2, null), ("Todd", "Glip", 3, null);