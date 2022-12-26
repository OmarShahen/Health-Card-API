const calculateRegistrationsTotalEarnings = (registrations) => {

    let total = 0

    for(let i=0;i<registrations.length;i++) {

        total += registrations[i].paid
    }

    return total
}

const calculateTotalAttendanceByDate = (registrations, fromDate, toDate) => {

    let attendances = []

    for(let i=0;i<registrations.length;i++) {

        for(let j=0;j<registrations[i].attendances.length;j++) {
            
            let attendance = registrations[i].attendances[j]
            const member = registrations[i].member
            const staff = registrations[i].staff
            const package = registrations[i].package
            
            if(attendance.attendanceDate >= fromDate && attendance.attendanceDate <= toDate) {
                attendance = { ...attendance, member: member[0], staff: staff[0], package: package[0] }
                attendances.push(attendance)
            }
        }
    }

    return attendances
}

const calculatePackagePercentage = (packageId, packages) => {

    let total = 0
    let packageTotal = 0

    for(let i=0;i<packages.length;i++) {

        if(packages[i]._id == packageId) {
            packageTotal = packages[i].count
        } 

        total += packages[i].count
    }

    const packagePercentage = ((packageTotal/total) * 100).toFixed(2)
    const otherPackagesPercentage = (((total - packageTotal) / total) * 100).toFixed(2)

    return { packagePercentage, otherPackagesPercentage, othersTotal: total - packageTotal, packageTotal }
}

const calculateCompletedPackageAttendances = (registrations) => {

    let complete = 0
    let incomplete = 0

    for(let i=0;i<registrations.length;i++) {

        const memberPackage = registrations[i].package
        const packageAttendance = memberPackage.attendance
        const memberAttended = registrations[i].attended

        if(memberAttended == packageAttendance) {
            complete += 1
        } else {
            incomplete += 1
        }
    }

    return { completedAttendance: complete, incompletedAttendance: incomplete, total: complete + incomplete }
}

const calculateGenderPercentages = members => {

    let male = 0
    let female = 0
    const TOTAL_MEMBERS = members.length 

    for(let i=0;i<members.length;i++) {

        if(members[i].gender == 'male') {
            male += 1
        } else if(members[i].gender == 'female') {
            female += 1 
        }
    }

    let malePercentage = ((male/TOTAL_MEMBERS) * 100).toFixed(2)
    let femalePercentage = ((female/TOTAL_MEMBERS) * 100).toFixed(2)

    malePercentage = String(malePercentage) != 'NaN' ? Math.round(Number.parseFloat(malePercentage)) : 0
    femalePercentage = String(femalePercentage) != 'NaN' ? Math.round(Number.parseFloat(femalePercentage)) : 0


    return { 
        totalMembers: TOTAL_MEMBERS, 
        totalMales: male, 
        totalFemales: female,
        malePercentage,
        femalePercentage
    }

}

const calculateTotalByKey = (registrations, key) => {

    let total = 0 
    for(let i=0;i<registrations.length;i++) {
        total += registrations[i][key]
    }

    return total
}

const calculateAndJoinStaffsPayments = (staffsIds, payments) => {

    const total = []

    for(let i=0;i<staffsIds.length;i++) {
        const staff = staffsIds[i]
        let staffTotal = 0

        for(let j=0;j<payments.length;j++) {
            const payment = payments[j]

            if(staff._id.equals(payment._id)) {
                staffTotal += payment.count
            }
        }

        total.push({ _id: staff._id, count: staffTotal })
    }

    return total
}

module.exports = { 
    calculateRegistrationsTotalEarnings, 
    calculateTotalAttendanceByDate, 
    calculatePackagePercentage,
    calculateCompletedPackageAttendances,
    calculateGenderPercentages,
    calculateTotalByKey,
    calculateAndJoinStaffsPayments
}