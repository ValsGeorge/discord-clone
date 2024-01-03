module.exports = (sequelize, DataTypes) => {
    const Channels = sequelize.define("Channels", {
        name: {
            type: DataTypes.STRING,
            validate: {
                isUnique: async function (value) {
                    const existingChannel = await Channels.findOne({
                        where: {
                            name: value,
                            serverId: this.serverId,
                            type: this.type,
                        },
                    });
                    if (existingChannel) {
                        throw new Error(
                            "Channel name must be unique within the server."
                        );
                    }
                },
            },
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Channels.associate = (models) => {
        Channels.belongsTo(models.Servers, {
            onDelete: "CASCADE",
            foreignKey: "serverId",
        });

        Channels.hasMany(models.Messages, {
            onDelete: "CASCADE",
            foreignKey: "channelId",
        });

        Channels.belongsTo(models.Categories, {
            onDelete: "CASCADE",
            foreignKey: "categoryId",
        });
    };

    return Channels;
};
