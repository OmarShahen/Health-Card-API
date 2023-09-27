const PatientSurveyModel = require('../../models/followup-service/patientSurveyModel')

const getPatientsSurveys = async (request, response) => {

    try {

        const patientsSurveys = await PatientSurveyModel.find()

        return response.status(200).json({
            accepted: true,
            patientsSurveys
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { getPatientsSurveys }