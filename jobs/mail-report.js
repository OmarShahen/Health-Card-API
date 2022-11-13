const { parentPort } = require('worker_threads')
const Cabin = require('cabin')
const { Signale } = require('signale')
const databaseConnection = require('../config/database')
const MemberModel = require('../models/MemberModel')
const RegistrationModel = require('../models/RegistrationModel')
const AttendanceModel = require('../models/AttendanceModel')
const { sendDailyReport } = require('../mails/reports')

const cabin = new Cabin({
    axe: { logger: new Signale() }
})

let isCancelled = false
if(parentPort) {
    parentPort.once('message', message => {
        if(message == 'cancel') {
            isCancelled = true
        }
    })
}

(async () => {

    if(isCancelled) {
        return
    }

    const dbConnection = await databaseConnection()

    const membersPromise = MemberModel.find()
    const registrationsPromise = RegistrationModel.find()
    const attendancesPromise = AttendanceModel.find()

    const [members, registrations, attendances] = await Promise
    .all([
        membersPromise,
        registrationsPromise,
        attendancesPromise
    ])

    await sendDailyReport({ members: members.length, registrations: registrations.length, attendances: attendances.length })

    if(parentPort) {
        parentPort.postMessage('done')
    } else {
        process.exit(0)
    }

})()