module.exports = app => {
    const employees = require('../controllers/employees.controller');
    let router = require('express').Router();
    
    router.get('/', employees.findAll);
    router.get('/:id', employees.findOne);
    // router.post('/', employees.create);
    // router.put('/:id', employees.update);
    // router.delete('/:id', employees.delete);
    app.use('/employees', router);
}