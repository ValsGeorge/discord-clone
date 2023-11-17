module.exports = (sequelize, DataTypes) => {
    const Channels = sequelize.define("Channels", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        serverId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
    });

    Channels.associate = (models) => {
        Channels.belongsTo(models.Servers, {
            foreignKey: "serverId",
            as: "server",
        });
    };

    return Channels;
};
