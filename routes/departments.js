const express = require('express');
const router = express.Router();
const _ = require('../controllers');
const auth = require('../middleware');
const isAdmin = require('../middleware/is_admin');

/** route for departments */
router.get('/', [auth, isAdmin], _.__departments.GetAll);
router.get('/get/:id', [auth, isAdmin], _.__departments.GetById);
router.post('/', [auth, isAdmin], _.__departments.Create);
router.patch('/update/:id', [auth, isAdmin], _.__departments.Update);
router.delete('/', [auth, isAdmin], _.__departments.Delete);

module.exports = router