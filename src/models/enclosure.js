// JavaScript source code
module.exports = (sequelize, DataTypes) => {
    var Enclosure = sequelize.define('Enclosure', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        surface: DataTypes.FLOAT
    });
    return Enclosure;
};