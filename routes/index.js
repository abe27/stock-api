const express = require('express');
const router = express.Router();
const routerUser = require('./user');
const departments = require('./departments');

router.get('/', (req, res) => res.status(503).send({message: 'Hello Api'}));
router.use('/user', routerUser);
router.use('/departments', departments);

module.exports = router