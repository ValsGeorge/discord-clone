module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define("Messages", {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        channelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Messages.associate = (models) => {
        Messages.belongsTo(models.Users, {
            foreignKey: "userId",
            as: "user",
        });

        Messages.belongsTo(models.Channels, {
            foreignKey: "channelId",
            as: "channel",
        });
    };

    return Messages;
};
