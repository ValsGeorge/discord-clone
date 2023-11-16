module.exports = (sequelize, DataTypes) => {
    const Chats = sequelize.define("Chats", {
        message: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        channelId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
    });

    Chats.associate = (models) => {
        Chats.belongsTo(models.Users, {
            foreignKey: "userId",
            as: "user",
        });
        Chats.belongsTo(models.Channels, {
            foreignKey: "channelId",
            as: "channel",
        });
    };

    return Chats;
};
