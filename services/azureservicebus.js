const { ServiceBusClient } = require("@azure/service-bus")

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
    }

}

module.exports = azureservicebus;