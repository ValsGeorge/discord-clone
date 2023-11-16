module.exports = (sequelize, DataTypes) => {
    const Channels = sequelize.define("Channels", {
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

    Channels.associate = (models) => {
        Channels.belongsTo(models.Users, {
            foreignKey: "userId",
            as: "user",
        });
    };

    return Channels;
};
