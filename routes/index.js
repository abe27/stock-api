const express = require('express');
const router = express.Router();
const routerUser = require('./user');

router.get('/', (req, res) => res.status(503).send({message: 'Hello Api'}));
router.use('/user', routerUser);

module.exports = router