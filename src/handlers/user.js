const express = require('express');
const router = express.Router();
const { authRoute } = require('../middlewares/token');
const userController = require('../controllers/userController');


router.post('/api/login', userController.login);
router.post('/api/register', userController.register);
router.get('/api/likes', authRoute, userController.getLikes);
router.post('/api/likes', authRoute, userController.postLike)



module.exports = {
  router
}