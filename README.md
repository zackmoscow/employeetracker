# employeetracker

## schema and seeds
- should be self explanatory, built to project specs and populated with sample data

## index.js
- init(), add(), view(), update() all built with inquirer functionality to route the user to the proper utility
- add functions: run queries to populate inquirer with proper list choices, run inquirer prompt, run queries to get IDs for database population, run INSERT INTO query
- view functions: role and departments are self explanatory. employees (and employees by manager) required more complex querires with a variety of joins and utilization of aliases for referencing a table multiple times
- terminate: same as add functions except use DELETE FROM query as the final step
- update functions: same as add function except use UPDATE query as the final step