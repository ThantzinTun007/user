const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.register);

router.post('/login', userController.logIn);

router.get('/me', userController.getUserInfo);

router.get('/get-all-users', userController.getAllUser);

router.patch('/update-user-info', userController.updateUser);

router.patch('/update-password', userController.updateUserPassword);

router.delete('/delete/:id', userController.deleteOneUser);

module.exports = router;