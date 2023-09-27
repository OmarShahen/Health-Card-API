
const getTreatmentExpirationDate = (drugs, fromDate) => {

    let largestNumberOfDays = 0

    for(let i=0;i<drugs.length;i++) {
        const drug = drugs[i]
        
        let durationNumber = drug.duration.number
        let durationTimeUnit = drug.duration.timeUnit.toLowerCase()

        if(durationTimeUnit == 'month') {
            durationNumber = durationNumber * 30
        } else if(durationTimeUnit == 'week') {
            durationNumber = durationNumber * 7
        }

        if(largestNumberOfDays < durationNumber) {
            largestNumberOfDays = durationNumber
        }
    }

    const treatmentExpirationDate = new Date(fromDate)
    treatmentExpirationDate.setDate(treatmentExpirationDate.getDate() + largestNumberOfDays)
    
    return treatmentExpirationDate

}

module.exports = { getTreatmentExpirationDate }