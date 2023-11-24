module.exports = (sequelize, DataTypes) => {
    const Servers = sequelize.define("Servers", {
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
        creatorId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        },
        inviteCode: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    });

    Servers.associate = (models) => {
        Servers.belongsTo(models.Users, {
            foreignKey: "creatorId",
            as: "user",
        });

        Servers.hasMany(models.Channels, {
            foreignKey: "serverId",
            as: "channels",
        });
        Servers.belongsToMany(models.Users, {
            through: "ServerMembers",
            foreignKey: "serverId",
            otherKey: "userId",
            as: "members",
        });
    };

    Servers.sync({ alter: true })
        .then(() => {
            console.log("ServersModel synchronized successfully");
        })
        .catch((error) => {
            console.error("Error synchronizing ServersModel:", error);
        });

    return Servers;
};
