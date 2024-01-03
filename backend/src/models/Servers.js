module.exports = (sequelize, DataTypes) => {
    const Servers = sequelize.define("Servers", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        inviteCode: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
    });

    Servers.associate = (models) => {
        Servers.belongsTo(models.Users, {
            foreignKey: "userId",
        });

        Servers.hasMany(models.Channels, {
            onDelete: "CASCADE",
            foreignKey: "serverId",
        });

        Servers.belongsToMany(models.Users, {
            through: "ServerMembers",
            onDelete: "CASCADE",
            foreignKey: "serverId",
        });

        Servers.hasMany(models.Categories, {
            onDelete: "CASCADE",
            foreignKey: "categoryId",
        });
    };

    return Servers;
};
