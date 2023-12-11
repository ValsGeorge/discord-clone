module.exports = (sequelize, DataTypes) => {
    const DMs = sequelize.define("DMs", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    DMs.associate = (models) => {
        DMs.belongsTo(models.Users, {
            foreignKey: "senderId",
        });

        DMs.belongsTo(models.Users, {
            foreignKey: "receiverId",
        });
    };

    return DMs;
};
