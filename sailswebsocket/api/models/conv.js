module.exports = {
    tableName: 'conv',
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    attributes: {
        conv_id: {
            type: 'string',
            primaryKey: true
        },
        conv_name: {
            type: 'string'
        },
        create_user: {
            type: 'string'
        },
        create_at: {
            type: 'string'
        }
    }
};