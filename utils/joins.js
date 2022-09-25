
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

module.exports = { 
    joinStaffsWithAttendances, 
    joinMembersWithAttendances, 
    joinPackages, 
    joinMonths,
    joinRegistrationsByAttendance,
    joinStaffRegistrationsByRegistrations
}