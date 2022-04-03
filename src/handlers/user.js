const express = require('express');
const router = express.Router();
const { authRoute } = require('../middlewares/token');
const userController = require('../controllers/userController');


router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/likes', authRoute, userController.getLikes);
router.post('/likes', authRoute, userController.postLike)



module.exports = {
  router
}