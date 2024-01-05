module.exports = (sequelize, DataTypes) => {

    const Posts = sequelize.define("Posts", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        type: {
            type: DataTypes.ENUM('Rice', 'Wheat', 'Maize', 'Potato'),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT('medium'),
            allowNull: false
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        active: {
            type: DataTypes.ENUM('1', '0'),
            allowNull: false,
            defaultValue: '1'
        },
        deleted: {
            type: DataTypes.ENUM('1', '0'),
            allowNull: false,
            defaultValue: '0'
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            }
        },
        updatedBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            }
        }
    });

    Posts.associate = (models) => {

        Posts.belongsTo(models.Users, {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
            as: 'createdByUser',
            foreignKey: {
                name: 'createdBy'
            }
        });

        Posts.belongsTo(models.Users, {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
            as: 'updatedByUser',
            foreignKey: {
                name: 'updatedBy'
            }
        });

    };

    return Posts;
};