
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

module.exports = { joinStaffsWithAttendances, joinMembersWithAttendances, joinPackages }