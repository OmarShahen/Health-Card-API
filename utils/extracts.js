
const extractAttendances = (registrations) => {

    let attendances = []

    for(let i=0;i<registrations.length;i++) {

        for(let j=0;j<registrations[i].attendances.length;j++) {
            let attendance = registrations[i].attendances[j]

            attendances.push(attendance)
        }
    }

    return attendances
}

const extractStaffs = (registrations) => {

    let staffs = []

    for(let i=0;i<registrations.length;i++) {

        for(let j=0;j<registrations[i].staffAttendances.length;j++) {
            let staff = registrations[i].staffAttendances[j]

            staffs.push(staff)
        }
    }

    return staffs
}

const extractMembers = (registrations) => {

    let members = []

    for(let i=0;i<registrations.length;i++) {

        for(let j=0;j<registrations[i].member.length;j++) {
            let member = registrations[i].member[j]

            members.push(member)
        }
    }

    return members
}

module.exports = { extractAttendances, extractStaffs, extractMembers }