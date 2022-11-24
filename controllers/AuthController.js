const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {
    static login(req, res) {
        res.render("auth/login");
    }
    static logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
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
            const createdUser = await User.create(user);
            req.session.userid = createdUser.id;
            req.flash('message', 'Cadastro realizado com sucesso!');
            req.session.save(() => {
                res.redirect('/');
            });
        } catch (err) {
            console.log(err);
        }
    }
    static async loginPost(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            req.flash('message', 'Usuário não encontrado');
            res.render('auth/register');
            return;
        }
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            req.flash('message', 'Senha inválida!');
            res.render('auth/login');
            return;
        }
        req.session.userid = user.id;
        req.flash('message', 'Bem vindo de volta!');
        req.session.save(() => {
            res.redirect('/');
        });
    }
};