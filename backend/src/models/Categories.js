module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define("Categories", {
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
    });

    Categories.associate = (models) => {
        Categories.belongsTo(models.Servers, {
            onDelete: "CASCADE",
            foreignKey: "serverId",
        });

        Categories.hasMany(models.Channels, {
            onDelete: "CASCADE",
            foreignKey: "categoryId",
        });
    };

    return Categories;
};
