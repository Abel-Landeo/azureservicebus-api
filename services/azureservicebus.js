const { ServiceBusClient, ServiceBusAdministrationClient } = require("@azure/service-bus")

const connectionString = process.env.SERVICEBUS_CONNECTION_STRING;
const azureservicebus = {
    publish: async (message, name) => {
        const sbClient = new ServiceBusClient(connectionString);
        const sender = sbClient.createSender(name);
        await sender.sendMessages({
            body: message
        });
        await sender.close();
        await sbClient.close();
    },
    
    listSubscriptions: async (topic) => {
        const sbAdmin = new ServiceBusAdministrationClient(connectionString);
        let result = [];
        let subs = sbAdmin.listSubscriptionsRuntimeProperties(topic);
        for await (const sub of subs) {
            result.push(sub);            
        }
        return result;
    } 

}

module.exports = azureservicebus;