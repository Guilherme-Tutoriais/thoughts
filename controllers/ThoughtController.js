const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = class ThoughtController {
    static async showAll(req, res) {
        res.render('thoughts/home');
    }
    static async dashboard(req, res) {
        const userid = req.session.userid;
        const user = await User.findOne({
            where: { id: userid },
            include: Thought,
            plain: true
        });
        if (!user) {
            res.redirect('/login');
        }
        //pra tirar informações extra do sequelize e só pegar as colunas
        const thougts = user.Thoughts.map((result) => result.dataValues);
        const emptyThoughts = thougts.length === 0;
        res.render('thoughts/dashboard', { thougts, emptyThoughts });
    }
    static createThought(req, res) {
        res.render('thoughts/create');
    }
    static async createThoughtSave(req, res) {
        const thought = {
            title: req.body.title,
            UserId: req.session.userid,
        };
        try {
            await Thought.create(thought);
            req.flash('message', 'Frase criada com sucesso');
            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            });
        } catch (err) {
            console.log(`erro ao salvar frase: ${err}`);
        }
    }
    static async removeThought(req, res) {
        const id = req.body.id;
        const userid = req.session.userid;
        try {
            await Thought.destroy({ where: { id: id, UserId: userid } });
            req.flash('message', 'Frase removida com sucesso');
            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            });
        } catch (erro) {
            console.log(`erro ao remover frase ${id}`);
        }
    }
    static async updateThought(req, res) {
        const id = req.params.id;
        const thought = await Thought.findOne({ where: { id: id }, raw: true });
        res.render('thoughts/edit', { thought });
    }
    static async updateThoughtSave(req, res) {
        const id = req.body.id;
        const thought = {
            title: req.body.title,
            UserId: req.session.userid,
        };
        try {
            await Thought.update(thought, { where: { id: id } });
            req.flash('message', 'Frase editada com sucesso');
            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            });
        } catch (err) {
            console.log(`erro ao editar frase: ${err}`);
        }
    }
};