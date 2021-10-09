const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send({message: 'Hello Api'}, 503));
router.get('/api/', (req, res) => res.send({message: 'Hello Api'}, 503));
router.get('/api/v1/', (req, res) => res.send({message: 'Hello Apiv1.'}, 200));

module.exports = router