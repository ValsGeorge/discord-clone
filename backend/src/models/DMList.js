module.exports = (sequelize, DataTypes) => {
    const DMList = sequelize.define("DMList", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
    });

    DMList.associate = (models) => {
        DMList.belongsTo(models.Users, {
            foreignKey: "userId",
        });

        DMList.belongsTo(models.Users, {
            foreignKey: "dmUserId",
        });
    };

    return DMList;
};
