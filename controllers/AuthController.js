const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {
    static login(req, res) {
        res.render("auth/login");
    }
    static register(req, res) {
        res.render("auth/register");
    }
    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body;
        if (password != confirmpassword) {
            //mensagem de senhas diferentes
            req.flash('message', 'As senhas não conferem!');
            res.render('auth/register');
            return;
        }
    }
};