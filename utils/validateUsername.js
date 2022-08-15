
const isNameValid = (username) => {

    const invalidChars = `0123456789~!@#$%^&*()_=+|][{};:<>/`

    for(let i=0;i<invalidChars.length;i++) {

        for(let j=0;j<username.length;j++) {

            if(invalidChars[i] == username[j]) {
                return false
            }
        }
    }

    return true
}

module.exports = { isNameValid }