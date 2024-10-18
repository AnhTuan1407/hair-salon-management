module.exports = function (sequelize, DataTypes) {

    return sequelize.define('LOCATION', {
        LOCATION_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        NAME: {
            type: DataTypes.STRING(255),
        },
    }, {
        tableName: 'LOCATION',
        timestamps: false,  // Bật timestamps để tự động thêm createdAt và updatedAt
        schema: 'dbo',
    });
}