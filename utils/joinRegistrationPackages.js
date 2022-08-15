
const joinRegistrationPackages = (packages, registrations) => {

    let memberRegistrations = []

    for(let i=0;i<registrations.length;i++) {

        for(let j=0;j<packages.length;j++) {

            if(packages[j]._id == registrations[i].packageId) {

                const memberRegistrationData = {
                    packageTitle: packages[j].title,
                    packageAttendance: packages[j].attendance,
                    packageExpiresIn: packages[j].expiresIn,
                    packagePrice: packages[j].price,
                    packageId: packages[j]._id,

                    registrationId: registrations[i]._id,
                    registrationIsActive: registrations[i].isActive,
                    registrationAttended: registrations[i].attended,
                    registrationExpiresAt: registrations[i].expiresAt,
                    registrationPaid: registrations[i].paid,
                    registrationDate: registrations[i].createdAt

                }

                memberRegistrations.push(memberRegistrationData)
                break

            }
        }
    }

    return memberRegistrations
}

module.exports = { joinRegistrationPackages }