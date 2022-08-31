
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

module.exports = { joinStaffsWithAttendances, joinMembersWithAttendances }