const bcrypt = require('bcrypt')


module.exports = (sequelize, DataTypes) => {
const admin = sequelize.define('admin',{
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value){
            const password = bcrypt.hashSync(value, 10)
            this.setDataValue('password', password)
        }
    }
},{
    timestamps: false
})
return admin
}