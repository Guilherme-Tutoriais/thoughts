const express = require('express');
const router = express.Router();
const ThoughtController = require('../controllers/ThoughtController');

router.get('/dashboard', ThoughtController.dashboard);
router.get('/', ThoughtController.showAll);

module.exports = router;