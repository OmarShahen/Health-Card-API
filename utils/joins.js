
const joinStaffsWithAttendances = (staffs, attendances) => {

    let memberAttendance = []

    for(let i=0;i<attendances.length;i++) {
        
        for(let j=0;j<staffs.length;j++) {

            if(toString(attendances[i].staffId) == toString(staffs[j]._id)) {
                memberAttendance.push({ ...attendances[i], ...staffs[j] })
                break
            }
        }

    }

    return memberAttendance
}

const joinMembersWithAttendances = (members, attendances) => {

    let memberAttendance = []

    for(let i=0;i<attendances.length;i++) {
        
        for(let j=0;j<members.length;j++) {

            if(toString(attendances[i].staffId) == toString(members[j]._id)) {
                memberAttendance.push({ ...attendances[i], ...members[j] })
                break
            }
        }

    }

    return memberAttendance
}

const joinRegistrationsByAttendance = (registrations, attendances) => {

    for(let i=0;i<registrations.length;i++) {
        registrations[i].registrationAttendances = []
        for(let j=0;j<attendances.length;j++) {
            if(toString(registrations[i]._id) == toString(attendances[j].registrationId)) {
                registrations[i].registrationAttendances.push(attendances[j])
            }
        }
    }

    return registrations
}

const joinStaffRegistrationsByRegistrations = (staffRegistrations, registrations) => {

    for(let i=0;i<staffRegistrations.length;i++) {
        staffRegistrations[i].registrations = []
        for(let j=0;j<registrations.length;j++) {
            if(toString(staffRegistrations[i].staff._id) == toString(registrations[j].staffId)) {
                staffRegistrations[i].registrations.push(registrations[j])
            }
        }
    }

    return staffRegistrations
}

const joinPackages = (packages, packagesIdsList) => {

    for(let i=0;i<packages.length;i++) {

        for(let j=0;j<packagesIdsList.length;j++) {

            if(packages[i]._id.toString() === packagesIdsList[j]._id.toString()) {

                packagesIdsList[j].title = packages[i].title
                break
            }
        }
    }

    return packagesIdsList
}

const joinMonths = (data) => {

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    for(let i=0;i<data.length;i++) {

        const dataMonthIndex = Number.parseInt(data[i]._id)
        data[i].month = months[dataMonthIndex - 1]
    }

    return data
}

const joinOfflineMembersIdsByOnlineMembers = (offlineMembers, onlineMembers) => {

    let membersIds = []

    for(let i=0;i<offlineMembers.length;i++) {
        const appId = onlineMembers[i]._id
        const clientId = offlineMembers[i].clientId

        membersIds.push({ appId, clientId })
    }

    return membersIds
}

const joinOfflineRegistrationsIdsByOnlineRegistrations = (offlineRegistrations, onlineRegistrations) => {

    let registrationsIds = []

    for(let i=0;i<offlineRegistrations.length;i++) {
        const appId = onlineRegistrations[i]._id
        const clientId = offlineRegistrations[i].clientId

        registrationsIds.push({ appId, clientId })
    }

    return registrationsIds
}

const joinOfflineRegistrationsByOnlineMembers = (registrations, membersIds) => {

    let newRegistrations = []

    for(let i=0;i<registrations.length;i++) {

        for(let j=0;j<membersIds.length;j++) {

            if(registrations[i].memberId == membersIds[j].clientId) {
                let registration = registrations[i]
                registration.memberId = membersIds[j].appId
                newRegistrations.push(registration)
                break
            }
        }
    }

    return newRegistrations
}

const joinOfflineAttendancesByOnlineMembers = (attendances, membersIds) => {

    let newAttendances = []

    for(let i=0;i<attendances.length;i++) {

        for(let j=0;j<membersIds.length;j++) {

            if(attendances[i].memberId == membersIds[j].clientId) {
                let attendance = attendances[i]
                attendance.memberId = membersIds[j].appId
                newAttendances.push(attendance)
                break
            }
        }
    }

    return newAttendances
}

const joinOfflineAttendancesByOnlineRegistrations = (attendances, registrationsIds) => {

    let newAttendances = []

    for(let i=0;i<attendances.length;i++) {

        for(let j=0;j<registrationsIds.length;j++) {

            if(attendances[i].registrationId == registrationsIds[j].clientId) {
                let attendance = attendances[i]
                attendance.registrationId = registrationsIds[j].appId
                newAttendances.push(attendance)
                break
            }
        }
    }

    return newAttendances
}

const joinOfflineCancelledRegistrationsByOnlineMembers = (cancelledRegistrations, membersIds) => {

    let newCancelledRegistrations = []

    for(let i=0;i<cancelledRegistrations.length;i++) {

        for(let j=0;j<membersIds.length;j++) {

            if(cancelledRegistrations[i].memberId == membersIds[j].clientId) {
                let cancelledRegistration = cancelledRegistrations[i]
                cancelledRegistration.memberId = membersIds[j].appId
                newCancelledRegistrations.push(cancelledRegistration)
                break
            }
        }
    }

    return newCancelledRegistrations
}

const joinOfflineCancelledAttendancesByOnlineMembers = (cancelledAttendances, membersIds) => {

    let newCancelledAttendances = []

    for(let i=0;i<cancelledAttendances.length;i++) {

        for(let j=0;j<membersIds.length;j++) {

            if(cancelledAttendances[i].memberId == membersIds[j].clientId) {
                let cancelledAttendance = cancelledAttendances[i]
                cancelledAttendance.memberId = membersIds[j].appId
                newCancelledAttendances.push(cancelledAttendance)
                break
            }
        }
    }

    return newCancelledAttendances
}

const joinOfflineCancelledAttendancesByOnlineRegistrations = (cancelledAttendances, registrationsIds) => {

    let newCancelledAttendances = []

    for(let i=0;i<cancelledAttendances.length;i++) {

        for(let j=0;j<registrationsIds.length;j++) {

            if(cancelledAttendances[i].registrationId == registrationsIds[j].clientId) {
                let cancelledAttendance = cancelledAttendances[i]
                cancelledAttendance.registrationId = registrationsIds[j].appId
                newCancelledAttendances.push(cancelledAttendance)
                break
            }
        }
    }

    return newCancelledAttendances
}

const joinOfflineFreezedRegistrationsByOnlineMembers = (freezedRegistrations, membersIds) => {

    let newFreezedRegistrations = []

    for(let i=0;i<freezedRegistrations.length;i++) {

        for(let j=0;j<membersIds.length;j++) {

            if(freezedRegistrations[i].memberId == membersIds[j].clientId) {
                let freezedRegistration = freezedRegistrations[i]
                freezedRegistration.memberId = membersIds[j].appId
                newFreezedRegistrations.push(freezedRegistration)
                break
            }
        }
    }

    return newFreezedRegistrations
}

const joinOfflineFreezedRegistrationsByOnlineRegistrations = (freezedRegistrations, registrationsIds) => {

    let newFreezedRegistrations = []

    for(let i=0;i<freezedRegistrations.length;i++) {

        for(let j=0;j<registrationsIds.length;j++) {

            if(freezedRegistrations[i].registrationId == registrationsIds[j].clientId) {
                let freezedRegistration = freezedRegistrations[i]
                freezedRegistration.registrationId = registrationsIds[j].appId
                newFreezedRegistrations.push(freezedRegistration)
                break
            }
        }
    }

    return newFreezedRegistrations
}

module.exports = { 
    joinStaffsWithAttendances, 
    joinMembersWithAttendances, 
    joinPackages, 
    joinMonths,
    joinRegistrationsByAttendance,
    joinStaffRegistrationsByRegistrations,
    joinOfflineMembersIdsByOnlineMembers,
    joinOfflineRegistrationsByOnlineMembers,
    joinOfflineRegistrationsIdsByOnlineRegistrations,
    joinOfflineAttendancesByOnlineMembers,
    joinOfflineAttendancesByOnlineRegistrations,
    joinOfflineCancelledRegistrationsByOnlineMembers,
    joinOfflineCancelledAttendancesByOnlineMembers,
    joinOfflineCancelledAttendancesByOnlineRegistrations,
    joinOfflineFreezedRegistrationsByOnlineMembers,
    joinOfflineFreezedRegistrationsByOnlineRegistrations
}