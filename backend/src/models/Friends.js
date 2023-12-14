module.exports = (sequelize, DataTypes) => {
    const Friends = sequelize.define("Friends", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
    });

    Friends.associate = (models) => {
        Friends.belongsTo(models.Users, {
            foreignKey: "userId",
        });
        Friends.belongsTo(models.Users, {
            foreignKey: "friendId",
        });
    };
    return Friends;
};
