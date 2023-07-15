const capitalizeFirstLetter = str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const concatenateHmacString = (hmacPayment) => {

    const {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        owner,
        pending,
        success
    }  = hmacPayment


    const orderId = hmacPayment.order.id
    const sourceDataPan = hmacPayment.source_data.pan
    const sourceDataSubType = hmacPayment.source_data.sub_type
    const sourceDataType = hmacPayment.source_data.type

    return `${amount_cents}${created_at}${currency}${error_occured}${has_parent_transaction}${id}${integration_id}${is_3d_secure}${is_auth}${is_capture}${is_refunded}${is_standalone_payment}${is_voided}${orderId}${owner}${pending}${sourceDataPan}${sourceDataSubType}${sourceDataType}${success}`
}

module.exports = { capitalizeFirstLetter, concatenateHmacString }