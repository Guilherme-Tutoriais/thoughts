const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = class ThoughtController {
    static async showAll(req, res) {
        console.log('showing all...');
        res.render('thoughts/home');
    }
};