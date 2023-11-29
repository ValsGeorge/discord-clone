module.exports = (sequelize, DataTypes) => {
    const ServerMembers = sequelize.define("ServerMembers", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
    });

    ServerMembers.associate = (models) => {
        ServerMembers.belongsTo(models.Servers, {
            as: "server",
        });
        ServerMembers.belongsTo(models.Users, {
            foreignKey: "userId",
        });
    };
    return ServerMembers;
};
