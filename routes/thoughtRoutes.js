const express = require('express');
const router = express.Router();
const ThoughtController = require('../controllers/ThoughtController');

const checkAuth = require('../helpers/auth').checkAuth;

router.get('/dashboard', checkAuth, ThoughtController.dashboard);
router.get('/add', checkAuth, ThoughtController.createThought);
router.get('/edit/:id', checkAuth, ThoughtController.updateThought);
router.post('/edit/', checkAuth, ThoughtController.updateThoughtSave);
router.post('/add', checkAuth, ThoughtController.createThoughtSave);
router.post('/remove', checkAuth, ThoughtController.removeThought);
router.get('/', ThoughtController.showAll);

module.exports = router;