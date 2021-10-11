const express = require('express');
const router = express.Router();
const auth = require('../middleware');
const controllers = require('../controllers');

/** route for user controller */
router.get('/', auth, controllers.__user.GetAll);
router.get('/get/:id', auth, controllers.__user.GetById);
router.post("/register", controllers.__user.Register);
router.post("/auth", controllers.__user.Auth);
router.get("/profile", auth, controllers.__user.Profile);
router.patch('/update', auth, controllers.__user.Update);
router.delete('/delete/:id', auth, controllers.__user.Delete);

module.exports = router