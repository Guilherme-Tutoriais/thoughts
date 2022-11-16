const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("thoughts", 'nodeuser', 'nodepassword', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    sequelize.authenticate();
    console.log('conexão com DB feita');
} catch (err) {
    console.log(`erro DB: ${err}`);
}