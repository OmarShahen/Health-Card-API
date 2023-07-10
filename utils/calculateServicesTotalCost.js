
const calculateServicesTotalCost = (services, servicesIds) => {

    let totalAmount = 0

    for(let i=0;i<servicesIds.length;i++) {
        const serviceId = servicesIds[i]
        for(let j=0;j<services.length;j++) {
            const service = services[j]
            if(service._id.equals(serviceId)) {
                totalAmount += service.cost
                break
            }
        }
    }

    return totalAmount
}


module.exports = { calculateServicesTotalCost }