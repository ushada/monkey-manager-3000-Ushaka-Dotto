module.exports = (sequelize, DataTypes) => {
    var Monkey = sequelize.define('Monkey', {
        name: DataTypes.STRING,
        height: DataTypes.FLOAT,
        weight: DataTypes.FLOAT,
        species: DataTypes.STRING
    });
    return Monkey;
};