const config = require('../config/config')
const authValidation = require('../validations/auth')
const utils = require('../utils/utils')
const AdminModel = require('../models/AdminModel')
const ClubModel = require('../models/ClubModel')
const MemberModel = require('../models/MemberModel')
const StaffModel = require('../models/StaffModel')
const ChainOwnerModel = require('../models/ChainOwnerModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const whatsappRequest = require('../APIs/whatsapp/send-verification-code')

const adminLogin = async (request, response) => {

    try {

        const dataValidation = authValidation.adminLogin(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, password } = request.body

        const adminsMailList = await AdminModel.find({ email })

        if(adminsMailList.length == 0) {

            return response.status(401).json({
                message: 'email does not exist',
                field: 'email'
            })
        }


        if(!bcrypt.compareSync(password, adminsMailList[0].password)) {

            return response.status(401).json({
                message: 'wrong password',
                field: 'password'
            })
        }

        const admin  = {
            _id: adminsMailList[0]._id,
            email: adminsMailList[0].email,
            phone: adminsMailList[0].phone,
            countryCode: adminsMailList[0].countryCode,
            role: adminsMailList[0].role,
            createdAt: adminsMailList[0].createdAt
        }

        admin.user = 'ADMIN'

        const token = jwt.sign(admin, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            admin: admin,
            token
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const staffLogin = async (request, response) => {

    try {

        const dataValidation = authValidation.staffLogin(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { phone, countryCode, password } = request.body

        const staffList = await StaffModel
        .find({ phone, countryCode, isAccountActive: true })

        if(staffList.length == 0) {
            return response.status(400).json({
                message: 'phone number is not registered',
                field: 'phone'
            })
        }

        if(!bcrypt.compareSync(password, staffList[0].password)) {
            return response.status(400).json({
                message: 'wrong password',
                field: 'password'
            })
        }


        const token = jwt.sign(staffList[0]._doc, config.SECRET_KEY, { expiresIn: '30d' })

        staffList[0].password = null

        return response.status(200).json({
            token: token,
            staff: staffList[0]
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const clubAdminLogin = async (request, response) => {

    try {

        const dataValidation = authValidation.staffLogin(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { phone, countryCode, password } = request.body

        const clubAdminList = await StaffModel
        .find({ phone, countryCode, isAccountActive: true })

        if(clubAdminList.length == 0) {
            return response.status(404).json({
                message: 'Account does not exists',
                field: 'phone'
            })
        }

        if(!bcrypt.compareSync(password, clubAdminList[0].password)) {
            return response.status(400).json({
                message: 'wrong password',
                field: 'password'
            })
        }

        clubAdminList[0].password = null

        const club = await ClubModel.findById(clubAdminList[0].clubId)

        const token = jwt.sign(clubAdminList[0]._doc, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            token,
            club,
            clubAdmin: clubAdminList[0]
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const chainOwnerLogin = async (request, response) => {

    try {

        const dataValidation = authValidation.chainOwnerLogin(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { phone, countryCode, password } = request.body

        const chainOwnerList = await ChainOwnerModel
        .find({ phone, countryCode, isAccountActive: true })

        if(chainOwnerList.length == 0) {
            return response.status(404).json({
                message: 'Account does not exists',
                field: 'phone'
            })
        }

        if(!bcrypt.compareSync(password, chainOwnerList[0].password)) {
            return response.status(400).json({
                message: 'wrong password',
                field: 'password'
            })
        }

        chainOwnerList[0].password = null

        let chainOwner = chainOwnerList[0]

        const ownedClubs = await ClubModel.aggregate([
            {
                $match: {
                    _id: { $in: chainOwner.clubs }
                }
            }
        ])

        chainOwner.clubs = ownedClubs


        const token = jwt.sign(chainOwnerList[0]._doc, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            token,
            chainOwner: chainOwnerList[0]
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const sendForgetPasswordMail = async (request, response) => {

    try {

        const { email } = request.body

        const emailList = await StaffModel.find({ email })

        if(emailList.length == 0) {
            return response.status(404).json({
                message: 'email does not exist',
                field: 'email'
            })
        }

        console.log(emailList)

        return response.status(200).json({
            message: 'done'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const sendMemberQRCodeWhatsapp = async (request, response) => {

    try {

        const { memberId, languageCode } = request.params

        if(!utils.isObjectId(memberId)) {
            return response.status(406).json({
                message: 'invalid member Id formate',
                field: 'memberId'
            })
        }

        if(!utils.isWhatsappLanguageValid(languageCode)) {
            return response.status(400).json({
                message: 'invalid language code',
                field: 'languageCode'
            })
        }

        const member = await MemberModel.findById(memberId)

        if(!member) {
            return response.status(404).json({
                message: 'member account does not exist',
                field: 'memberId'
            })
        }

        if(!member.canAuthenticate) {
            return response.status(400).json({
                message: 'authentication is closed for this member',
                field: 'memberId'
            })
        }

        const memberClub = await ClubModel.findById(member.clubId)

        const QR_CODE_URL = member.QRCodeURL
        const memberPhone = member.countryCode + member.phone
        const clubData = {
            memberName: member.name,
            name: memberClub.name,
            phone: memberClub.countryCode + memberClub.phone,
            address: `${memberClub.location.address}, ${memberClub.location.city}, ${memberClub.location.country}`
        }

       const messageResponse = await whatsappRequest
       .sendMemberResetQRCode(memberPhone, languageCode, QR_CODE_URL, clubData)

        if(messageResponse.isSent == false) {
            return response.status(400).json({
                message: 'could not send member QR code message',
                field: 'memberId'
            })
        }


        return response.status(200).json({
            message: 'verification message is sent successfully',
            member,
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
    adminLogin,
    staffLogin,
    clubAdminLogin,
    chainOwnerLogin,
    sendForgetPasswordMail,
    sendMemberQRCodeWhatsapp
}