const express = require('express');
const { createUser, getUsers } = require('../controllers/userController');
const requestLogger = require("../middlewares/logger");
const router = express.Router();

router.post('/',requestLogger, createUser);
router.get('/',requestLogger, getUsers);

module.exports = router;
