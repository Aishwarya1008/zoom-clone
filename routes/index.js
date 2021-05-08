const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.get('/:room_id', homeController.room);

module.exports = router;