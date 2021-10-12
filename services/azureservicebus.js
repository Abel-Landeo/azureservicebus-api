const { ServiceBusClient, ServiceBusAdministrationClient } = require("@azure/service-bus")

const connectionString = process.env.SERVICEBUS_CONNECTION_STRING;
const entityName = process.env.SERVICEBUS_ENTITY_NAME;
const azureservicebus = {
    publish: async (message) => {
        const sbClient = new ServiceBusClient(connectionString);
        const sender = sbClient.createSender(entityName);
        await sender.sendMessages({
            body: message
        });
        await sender.close();
        await sbClient.close();
    },

    peek: async (type, subscription, isDeadLetter, limit) => {
        const sbClient = new ServiceBusClient(connectionString);
        let receiver;
        let options = isDeadLetter?{subQueueType: "deadLetter"}:{};
        if (type === 'queue') {
            receiver = sbClient.createReceiver(entityName, options);            
        } else if(type === 'topic') {
            receiver = sbClient.createReceiver(entityName, subscription, options);
        } else {
            throw new Error("entity type not especified");
        }
        const peekedMessages = await receiver.peekMessages(limit);
        await receiver.close();
        await sbClient.close();
        const returnableMessages = peekedMessages.map(message => {
            const returnableMessage = {
                messageId: message.messageId,
                body: message.body,
                deadLetterReason: message.deadLetterReason,
                deadLetterErrorDescription: message.deadLetterErrorDescription
            };
            return returnableMessage;            
        });
        return returnableMessages;
    },
    
    listSubscriptions: async () => {
        const sbAdmin = new ServiceBusAdministrationClient(connectionString);
        let result = [];
        let subs = sbAdmin.listSubscriptionsRuntimeProperties(entityName);
        for await (const sub of subs) {
            result.push(sub);            
        }
        return result;
    },

    listRules: async (subscription) => {
        const sbAdmin = new ServiceBusAdministrationClient(connectionString);
        let result = [];
        let rules = sbAdmin.listRules(entityName, subscription);
        for await (const rule of rules) {
            result.push(rule);
        }
        return result;
    }
}

module.exports = azureservicebus;