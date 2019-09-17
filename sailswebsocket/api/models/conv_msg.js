module.exports ={
    tableName: 'conv_msg',
    autoPK:false,
    autoCreatedAt:false,
    autoUpdatedAt:false,
    attributes:{
        msg_id:{
            type:'string',
            primaryKey: true
        },
        msg:{
            type:'string'
        },
        create_at:{
            type:'string'
        },
        conv_id:{
            type:'string'
        },
        from_user: {
            type:'string'
        }
    }
};