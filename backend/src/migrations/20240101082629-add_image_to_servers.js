module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("Servers", "image", {
            type: Sequelize.STRING,
            unique: false,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("Servers", "image");
    },
};
