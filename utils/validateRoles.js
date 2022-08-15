const config = require('../config/config')

const isAdminRole = (role) => {

    const roles = config.ADMIN_ROLES

    for(let i=0;i<roles.length;i++) {

        if(roles[i] == role) {
            return true
        }
    }

    return false
}

module.exports = { isAdminRole }