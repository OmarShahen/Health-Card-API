const isRolesValid = (userRolesList, authorizedRolesList) => {

    for(let i=0;i<authorizedRolesList.length;i++) {
        const role = authorizedRolesList[i]
        for(let j=0;j<userRolesList.length;j++) {
            const userRole = userRolesList[j]
            if(userRole === role) {
                return true
            }
        }
    }

    return false
}

module.exports = { isRolesValid }