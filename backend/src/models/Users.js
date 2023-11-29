module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
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
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "/default-profile-picture.jpg",
        },
    });

    Users.associate = (models) => {
        Users.hasMany(models.Servers, {
            foreignKey: "userId",
        });
        Users.belongsToMany(models.Servers, {
            through: "ServerMembers",
            onDelete: "CASCADE",
            foreignKey: "userId",
        });
    };

    return Users;
};
