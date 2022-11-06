const utils = require('../utils/utils')
const MemberModel = require('../models/MemberModel')
const RegistrationModel = require('../models/RegistrationModel')
const AttendanceModel = require('../models/AttendanceModel')
const CancelledRegistrationModel = require('../models/CancelledRegistrationModel')
const CancelledAttendanceModel = require('../models/CancelledAttendanceModel')
const FreezedRegistrationModel = require('../models/FreezeRegistrationModel')
const membersValidations = require('../validations/members')

const updateMembers = async members => {

    let updateMembers = []

    for(let i=0;i<members.length;i++) {
        
        const updatedMember = await MemberModel.findByIdAndUpdate(members[i]._id, members[i], { new:true })
        updateMembers.push(updatedMember)
    }

    return updateMembers
}

const updateRegistrations = async registrations => {

    let updatedRegistrations = []

    for(let i=0;i<registrations.length;i++) {
        const updatedRegistration = await RegistrationModel.findByIdAndUpdate(registrations[i]._id, registrations[i], { new: true })
        updatedRegistrations.push(updatedRegistration)
    }

    return updatedRegistrations
}

const updateFreezedRegistrations = async freezedregistrations => {

    let updatedFreezedRegistrations = []

    for(let i=0;i<freezedregistrations.length;i++) {
        const updatedFreezedRegistration = await FreezedRegistrationModel.findByIdAndUpdate(freezedregistrations[i]._id, freezedregistrations[i], { new: true })
        updatedFreezedRegistrations.push(updatedFreezedRegistration)
    }

    return updatedFreezedRegistrations
} 

const validateAddMembersData = (members) => {

    let validMembers = []
    let invalidMembers = []

    for(let i=0;i<members.length;i++) {

        const validatedMember = membersValidations.offlineAddMemberData(members[i])

        if(validatedMember.isAccepted) {
            validMembers.push(members[i])
        } else {

            invalidMembers.push({ member: members[i], errors: validatedMember.errors })
        }
    }

    return { validMembers, invalidMembers }
}

const checkAddMemberUniquness = async (members) => {

    let validMembers = []
    let invalidMembers = []

    for(let i=0;i<members.length;i++) {

        let errors = []

        const emailListPromise = MemberModel
        .find({ clubId: members[i].clubId, email: members[i].email })

        const phoneListPromise = MemberModel
        .find({ clubId: members[i].clubId, countryCode: members[i].countryCode, phone: members[i].phone })

        const [emailList, phoneList] = await Promise.all([ emailListPromise, phoneListPromise ])

        if(emailList.length != 0) {
            errors.push({ isAccepted: false, message: 'email is already registered', field: 'email' })
        }

        if(phoneList.length != 0) {
            errors.push({ isAccepted: false, message: 'phone is already registered', field: 'phone' })
        }

        if(errors.length != 0) {
            invalidMembers.push(members[i], errors)
        } else {
            validMembers.push(members[i])
        }

    }

    return { validMembers, invalidMembers }

}

const checkUpdateMemberUniquness = async (members) => {

    let validMembers = []
    let invalidMembers = []

    for(let i=0;i<members.length;i++) {

        let errors = []

        const memberIdPromise = MemberModel.findById(members[i]._id)

        const emailListPromise = MemberModel
        .find({ clubId: members[i].clubId, email: members[i].email })

        const phoneListPromise = MemberModel
        .find({ clubId: members[i].clubId, countryCode: members[i].countryCode, phone: members[i].phone })

        const [memberId, emailList, phoneList] = await Promise.all([ memberIdPromise, emailListPromise, phoneListPromise ])

        if(!memberId) {
            errors.push({ isAccepted: false, message: 'member Id is not accepted', field: '_id' })
        }
        
        if(emailList.length != 0) {
            errors.push({ isAccepted: false, message: 'email is already registered', field: 'email' })
        }

        if(phoneList.length != 0) {
            errors.push({ isAccepted: false, message: 'phone is already registered', field: 'phone' })
        }

        if(errors.length != 0) {
            invalidMembers.push(members[i], errors)
        } else {
            validMembers.push(members[i])
        }

    }

    return { validMembers, invalidMembers }

}

const validateUpdateMembersData = (members) => {

    let validMembers = []
    let invalidMembers = []

    for(let i=0;i<members.length;i++) {

        const validatedMember = membersValidations.offlineUpdateMemberData(members[i])

        if(validatedMember.isAccepted) {
            validMembers.push(members[i])
        } else {

            invalidMembers.push({ member: members[i], errors: validatedMember.errors })
        }
    }

    return { validMembers, invalidMembers }
}

const uploadMembers = async (members) => {

    let offlineMembersAdd = members.add
    let offlineMembersUpdate = members.update

    const validatedMembersToAdd = validateAddMembersData(offlineMembersAdd)
    const validatedMembersToUpdate = validateUpdateMembersData(offlineMembersUpdate)

    const addMemberUniqunessCheck = await checkAddMemberUniquness(validatedMembersToAdd.validMembers)

    offlineMembersAdd = addMemberUniqunessCheck.validMembers
    offlineMembersUpdate = validatedMembersToUpdate.validMembers

    const invalidMembers = [
        ...validatedMembersToAdd.invalidMembers, 
        ...validatedMembersToUpdate.invalidMembers,
        ...addMemberUniqunessCheck.invalidMembers,
    ]

    offlineMembersAdd.forEach(member => member.clientId = member.id)
    const addedMembers = await MemberModel.insertMany(offlineMembersAdd)
    const membersIds = utils.joinOfflineMembersIdsByOnlineMembers(offlineMembersAdd, addedMembers)
    const updatedMembers = await updateMembers(offlineMembersUpdate)

    return { addedMembers, membersIds, updatedMembers, invalidMembers }

}

const uploadRegistrations = async (registrations, membersIds) => {

    let offlineRegistrations = registrations.add
    let offlineRegistrationsUpdate = registrations.update
    let offlineRegistrationsDelete = registrations.delete

    offlineRegistrations.forEach(registration => registration.clientId = registration.id)
    const stagedRegistrations = utils
    .joinOfflineRegistrationsByOnlineMembers(offlineRegistrations, membersIds)
    const addedRegistrations = await RegistrationModel.insertMany(stagedRegistrations)
    const registrationsIds = utils
    .joinOfflineRegistrationsIdsByOnlineRegistrations(offlineRegistrations, addedRegistrations)

    const updatedRegistrations = await updateRegistrations(offlineRegistrationsUpdate)

    const deleteRegistrationsIds = offlineRegistrationsDelete.map(registration => registration._id)
    const deletedRegistrations = await RegistrationModel.deleteMany({ _id: { $in: deleteRegistrationsIds }})

    return { addedRegistrations, updatedRegistrations, deletedRegistrations, registrationsIds }

}

const uploadAttendances = async (attendances, membersIds, registrationsIds) => {

    let offlineAttendancesAdd = attendances.add
    let offlineAttendancesDelete = attendances.delete

    let stagedAttendances = utils.joinOfflineAttendancesByOnlineMembers(offlineAttendancesAdd, membersIds)
    stagedAttendances = utils.joinOfflineAttendancesByOnlineRegistrations(stagedAttendances, registrationsIds)
    const addedAttendances = await AttendanceModel.insertMany(stagedAttendances)

    const deletedAttendancesIds = offlineAttendancesDelete.map(attendance => attendance._id)
    const deletedAttendances = await AttendanceModel.deleteMany({ _id: { $in: deletedAttendancesIds }})

    return { addedAttendances, deletedAttendances }
}

const uploadCancelledRegistrations = async (cancelledRegistrations, membersIds) => {

    let offlineCancelledRegistrations = cancelledRegistrations.add

    let stagedCancelledRegistrations = utils.joinOfflineCancelledRegistrationsByOnlineMembers(offlineCancelledRegistrations, membersIds)
    const addedCancelledRegistrations = await CancelledRegistrationModel.insertMany(stagedCancelledRegistrations)

    return { addedCancelledRegistrations }
}

const uploadCancelledAttendances = async (cancelledAttendances, membersIds, registrationsIds) => {

    let offlineCancelledAttendances = cancelledAttendances.add

    let stagedCancelledAttendances = utils.joinOfflineCancelledAttendancesByOnlineMembers(offlineCancelledAttendances, membersIds)
    stagedCancelledAttendances = utils.joinOfflineCancelledAttendancesByOnlineRegistrations(stagedCancelledAttendances, registrationsIds)
    const addedCancelledAttendances = await CancelledAttendanceModel.insertMany(stagedCancelledAttendances)

    return { addedCancelledAttendances }

}

const uploadFreezedRegistrations = async (freezedRegistrations, membersIds, registrationsIds) => {

    let offlineFreezedRegistrationsAdd = freezedRegistrations.add
    let offlineFreezedRegistrationsUpdate = freezedRegistrations.update

    let stagedFreezedRegistrations = utils.joinOfflineFreezedRegistrationsByOnlineMembers(offlineFreezedRegistrationsAdd, membersIds)
    stagedFreezedRegistrations = utils.joinOfflineFreezedRegistrationsByOnlineRegistrations(stagedFreezedRegistrations, registrationsIds)
    const addedFreezedRegistrations = await FreezedRegistrationModel.insertMany(stagedFreezedRegistrations)

    const updatedFreezedRegistrations = await updateFreezedRegistrations(offlineFreezedRegistrationsUpdate)

    return { addedFreezedRegistrations, updatedFreezedRegistrations }
}

module.exports = (io, socket) => {

    const upload = async (data) => {

        try {

            data = JSON.parse(data)


            const { addedMembers, membersIds, updatedMembers, invalidMembers } = await uploadMembers(data.members)

            console.log(addedMembers)

            /*const { addedRegistrations, updatedRegistrations, deletedRegistrations, registrationsIds } = await uploadRegistrations(data.registrations, membersIds)

            const { addedAttendances, deletedAttendances } = await uploadAttendances(data.attendances, membersIds, registrationsIds)

            const { addedCancelledRegistrations } = await uploadCancelledRegistrations(data.cancelledRegistrations, membersIds)
            
            const { addedCancelledAttendances } = await uploadCancelledAttendances(data.cancelledAttendances, membersIds, registrationsIds)

            const { addedFreezedRegistrations, updatedFreezedRegistrations } = await uploadFreezedRegistrations(data.freezedRegistrations, membersIds, registrationsIds)
*/

        } catch(error) {

            console.error(error)
            return socket.emit('error', { message: 'internal server error' })
        }
    
        
                
    }


    socket.on('offline:upload', upload)
}