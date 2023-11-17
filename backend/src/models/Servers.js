module.exports = (sequelize, DataTypes) => {
    const Servers = sequelize.define("Servers", {
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
        userId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
    });

    Servers.associate = (models) => {
        Servers.belongsTo(models.Users, {
            foreignKey: "userId",
            as: "user",
        });

        Servers.hasMany(models.Channels, {
            foreignKey: "serverId",
            as: "channels",
        });
    };

    return Servers;
};
