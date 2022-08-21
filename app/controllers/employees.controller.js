const employees = [
    {
      "employeeId": 1,
      "name": "Guy Gardner",
      "managerId": 15
    },
    {
      "employeeId": 2,
      "name": "Arthur Curry",
      "managerId": 12
    },
    {
      "employeeId": 3,
      "name": "John Stewart",
      "managerId": 7
    },
    {
      "employeeId": 4,
      "name": "Ray Palmer",
      "managerId": 6
    },
    {
      "employeeId": 5,
      "name": "Jessica Cruz",
      "managerId": 15
    },
    {
      "employeeId": 6,
      "name": "Shayera Hol",
      "managerId": 12
    },
    {
      "employeeId": 7,
      "name": "Bruce Wayne",
      "managerId": 17
    },
    {
      "employeeId": 8,
      "name": "Kyle Rayner",
      "managerId": 15
    },
    {
      "employeeId": 9,
      "name": "Billy Batson",
      "managerId": 6
    },
    {
      "employeeId": 10,
      "name": "Kiliwog",
      "managerId": 3
    },
    {
      "employeeId": 11,
      "name": "Dinah Drake",
      "managerId": 7
    },
    {
      "employeeId": 12,
      "name": "Diana Prince",
      "managerId": 17
    },
    {
      "employeeId": 13,
      "name": "Sinestro",
      "managerId": 3
    },
    {
      "employeeId": 14,
      "name": "J'onn J'onzz",
      "managerId": 12
    },
    {
      "employeeId": 15,
      "name": "Hal Jordan",
      "managerId": 3
    },
    {
      "employeeId": 16,
      "name": "Oliver Queen",
      "managerId": 7
    },
    {
      "employeeId": 17,
      "name": "Clark Kent"
    },
    {
      "employeeId": 18,
      "name": "Zatanna Zatara",
      "managerId": 7
    },
    {
      "employeeId": 19,
      "name": "Barry Allen",
      "managerId": 17
    }
  ]

exports.findAll = (req, res) => {
    res.status(200).json({
        employees: employees
    });
}

function findSubordinates(employeeId) {
    let subordinates = [];
    employees.forEach(e => {
        let parents = [employeeId];

        if (e.managerId == employeeId) {
            if (!parents.includes(e.employeeId)) {
                console.log(e);
                subordinates.push(findSubordinates(e.employeeId));
            }
            parents.push(e.employeeId);
        }
    });
    
    return subordinates;
}

exports.findOne = (req, res) => {
    let id = req.params.id;
    let includeReportingTree = req.query.includeReportingTree;
    
    if (includeReportingTree) {
        let employee = employees.find(employee => employee.employeeId == id);
        
        res.status(200).json({
            employee,
            subordinates: findSubordinates(id)
        });
    } else {
        res.json({employee: employees.find(employee => employee.employeeId == id), status: 200});
    }
}