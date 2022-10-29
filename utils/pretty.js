const username = (username) => {

    splitted = username.split(' ')

    let firstName = splitted[0]
    let lastName = splitted[1]

    const firstNameLetter = firstName[0]
    const lastNameLetter = lastName[0]

    newFirstName = firstName.replace(firstNameLetter, firstNameLetter.toUpperCase())
    newLastName = lastName.replace(lastNameLetter, lastNameLetter.toUpperCase())

    return `${newFirstName} ${newLastName}`
}

module.exports = { username }