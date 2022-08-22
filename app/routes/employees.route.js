const { body } = require('express-validator');

module.exports = app => {
    const employees = require('../controllers/employees.controller');
    let router = require('express').Router();
    
    router.get('/', employees.findAll);
    router.get('/:id', employees.findOne);
    router.post('/', 
        body('name').not().isEmpty().trim().escape(), 
        body('managerId').not().isEmpty().isInt().toInt(), 
        employees.create);
    router.put('/:id', 
        body('name').not().isEmpty().trim().escape(), 
        body('managerId').not().isEmpty().isInt().toInt(),
        employees.update);
    router.delete('/:id', employees.delete);
    app.use('/employees', router);
}