module.exports = (sequelize, DataTypes) => {
    const ServerMembers = sequelize.define("ServerMembers", {
        serverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    ServerMembers.associate = (models) => {
        ServerMembers.belongsTo(models.Servers, {
            foreignKey: "id",
            as: "server",
        });
        ServerMembers.belongsTo(models.Users, {
            foreignKey: "id",
            as: "user",
        });
    };

    return ServerMembers;
};
