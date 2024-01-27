
const isPhoneValid = (phoneNumber, max=11) => {

    const numbers = '0123456789'

    if(max && phoneNumber.length != max) {
        return false
    }

    for(let i=0;i<phoneNumber.length;i++) {

        let found = false

        for(let j=0;j<numbers.length;j++) {


            if(phoneNumber[i] == numbers[j]) {
                found = true
                break
            }
        }

        if(found == false) {
            return false
        }
    }

    return true
}

module.exports = { isPhoneValid }