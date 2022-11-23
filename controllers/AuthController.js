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
        const userExists = await User.findOne({ where: { email: email } });
        if (userExists) {
            req.flash('message', 'Esse e-mail já está em uso!');
            res.render('auth/register');
            return;
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(password, salt);
        const user = {
            name,
            email,
            password: hashedPass
        };

        try {
            await User.create(user);
            req.flash('message', 'Cadastro realizado com sucesso!');
            res.redirect('/');
        } catch (err) {
            console.log(err);
        }
    }
};