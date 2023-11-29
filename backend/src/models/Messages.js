module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define("Messages", {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Messages.associate = (models) => {
        Messages.belongsTo(models.Users, {
            foreignKey: "userId",
        });

        Messages.belongsTo(models.Channels, {
            foreignKey: "channelId",
        });
    };

    return Messages;
};
