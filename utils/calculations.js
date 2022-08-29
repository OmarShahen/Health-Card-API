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

module.exports = { calculateRegistrationsTotalEarnings, calculateTotalAttendanceByDate }