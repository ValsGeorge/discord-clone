module.exports = (sequelize, DataTypes) => {
    const FriendRequest = sequelize.define("FriendRequest", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "pending",
        },
    });

    FriendRequest.associate = (models) => {
        FriendRequest.belongsTo(models.Users, {
            foreignKey: "userId",
        });
        FriendRequest.belongsTo(models.Users, {
            foreignKey: "friendRequestId",
        });
    };
    return FriendRequest;
};
