const { validationResult } = require('express-validator');
let employees = require('./employees');

exports.findAll = (req, res) => {
    res.status(200).json({
        message: "Employees found",
        employees
    });
}

exports.findOne = (req, res) => {
    let id = req.params.id;
    let includeReportingTree = req.query.includeReportingTree;
    
    if (includeReportingTree=="true") {
        let employee = copy(employees).find(employee => employee.employeeId == id);
        employee.subordinates = findSubordinates(id);

        res.status(200).json({
            message: "Employee found",
            employee
        });
    } else {
        let employee = employees.find(employee => employee.employeeId == id);
        if (employee) {
            res.status(200).json({
                message: "Employee found",
                employee
            });
        } else {
            res.status(404).json({
                message: "Employee not found"
            });
        }
    }
}

exports.create = (req, res) => {
    let highestId = employees.reduce((prev, curr) => {
        return prev.employeeId > curr.employeeId ? prev : curr;
    }).employeeId || 0;

    let employee = {
        employeeId: highestId + 1,
        name: req.body.name,
        managerId: req.body.managerId
    };

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    employees.push(employee);
    
    if (employees.find(e => e.employeeId == employee.managerId)) {
        res.status(201).json({
            message: "Employee created successfully",
            employee
        });
    } else {
        res.status(400).json({
            message: "Invalid managerId, manager not found"
        });
    }
}

exports.update = (req, res) => {
    let id = req.params.id;
    let employee = employees.find(e => e.employeeId == id);
    if (!employee) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    let newEmployee = {
        employeeId: employee.employeeId,
        name: req.body.name,
        managerId: req.body.managerId
    };

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    if (employees.find(e => e.employeeId == employee.managerId)) {
        Object.keys(newEmployee).forEach(k => {
            employee[k] = newEmployee[k];
        });
        res.status(200).json({
            message: "Employee updated successfully",
            employee
        });
    } else {
        res.status(400).json({
            message: "Invalid managerId, manager not found"
        });
    }
}

exports.delete = (req, res) => {
    let id = req.params.id;
    let employee = employees.find(e => e.employeeId == id);
    employees = employees.filter(e => e.employeeId != id);

    if (employee) {
        res.status(200).json({
            message: "Employee deleted successfully",
            employee
        });
    } else {
        res.status(404).json({
            message: "Employee not found"
        });
    }
}

function copy(obj) {
    var output, v, key;
    output = Array.isArray(obj) ? [] : {};
    for (key in obj) {
        v = obj[key];
        output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
}

function findSubordinates(employeeId) {
    let subordinates = [];
    let exceptMine = copy(employees).filter(employee => employee.employeeId != employeeId);

    exceptMine.forEach(e => {
        let parents = [employeeId];

        if (e.managerId == employeeId) {
            if (!parents.includes(e.employeeId)) {
                e.subordinates = findSubordinates(e.employeeId);
                if (!e.subordinates.length) {
                    delete e.subordinates;
                }
                subordinates.push(e);
            }
            parents.push(e.employeeId);
        }
    });
    
    return subordinates;
}
