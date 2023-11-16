module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        nickname: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Users;
};
