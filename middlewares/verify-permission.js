const config = require('../config/config')
const jwt = require('jsonwebtoken')

const verifyToken = (request, response, next) => {

    try {

        if(!request.headers['x-access-token']) {
            
            return response.status(401).json({
                message: 'unauthorized to access resources',
                field: 'x-access-token'
            })
        }

        const token = request.headers['x-access-token']

        jwt.verify(token, config.SECRET_KEY, (error, data) => {

            if(error) {
                return response.status(401).json({
                    message: 'invalid token',
                    field: 'token'
                })
            }
            
            request.user = data
            
            return next()
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const adminPermission = (request, response, next) => {

    try {

        const validRoles = ['APP-ADMIN']

        verifyToken(request, response, () => {

            const { role } = request.user

            if(validRoles.includes(role)) {

                next()

            } else {

                return response.status(403).json({
                    message: 'unauthorized',
                    field: 'token'
                })
            }
            
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const adminAndClubAdminPermission = (request, response, next) => {

    try {

        const validRoles = ['APP-ADMIN', 'CLUB-OWNER']

        verifyToken(request, response, () => {

            const { role } = request.user

            if(validRoles.includes(role)) {

                next()

            } else {

                return response.status(403).json({
                    message: 'unauthorized',
                    field: 'token'
                })
            }
            
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const adminAndStaffPermission = (request, response, next) => {

    try {

        const validRoles = ['APP-ADMIN', 'STAFF']

        verifyToken(request, response, () => {

            const { role } = request.user

            if(validRoles.includes(role)) {

                next()

            } else {

                return response.status(403).json({
                    message: 'unauthorized',
                    field: 'token'
                })
            }
            
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const appUsersPermission = (request, response, next) => {

    try {

        const validRoles = ['APP-ADMIN', 'STAFF', 'CLUB-ADMIN', 'CHAIN-OWNER']

        verifyToken(request, response, () => {

            const { role } = request.user

            if(validRoles.includes(role)) {

                next()

            } else {

                return response.status(403).json({
                    message: 'unauthorized',
                    field: 'token'
                })
            }
            
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { 
    verifyToken,
    adminPermission, 
    adminAndClubAdminPermission, 
    adminAndStaffPermission, 
    appUsersPermission 
}