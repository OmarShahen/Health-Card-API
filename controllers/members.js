const ClubModel = require('../models/ClubModel')
const MemberModel = require('../models/MemberModel')
const RegistrationModel = require('../models/RegistrationModel')
const memberValidation = require('../validations/members')
const utils = require('../utils/joinRegistrationPackages')

const addMember = async (request, response) => {

    try {

        const dataValidation = memberValidation.memberData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, name, email, phone, phoneCountryCode } = request.body

        const club = await ClubModel.findById(clubId)

        if(!club) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        if(email) {

            const emailList = await MemberModel
            .find({ clubId, email })

            if(emailList.length != 0) {
                return response.status(400).json({
                    message: 'email is already registered in the club',
                    field: 'email'
                })
            }
        }

        const phoneList = await MemberModel
        .find({ clubId, phone, phoneCountryCode })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: 'phone number already registered in the club',
                field: 'phone'
            })
        }


        const memberData = { clubId, name, email, phone, phoneCountryCode }

        const memberObj = new MemberModel(memberData)
        const newMember = await memberObj.save()

    
        return response.status(200).json({
            message: `${name} is added to the club successfully`,
            newMember
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message:'internal server error',
            error: error.message
        })
    }
}

const searchMembersByPhone = async (request, response) => {

    try {

        const { clubId } = request.params
        const { phoneCountryCode, phone } = request.query

        let members

        if(phoneCountryCode && phone) {

            const validPhoneCounterCode = '+' + phoneCountryCode

            members = await MemberModel
            .find({ clubId, phoneCountryCode: validPhoneCounterCode, phone })
            .sort({ createdAt: -1 })

        } else {

            members = await MemberModel
            .find({ clubId })
            .sort({ createdAt: -1 })

        }

        
        return response.status(200).json({
            members: members
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}


module.exports = { addMember, searchMembersByPhone }