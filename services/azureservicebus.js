const { ServiceBusClient, ServiceBusAdministrationClient } = require("@azure/service-bus")

const connectionString = process.env.SERVICEBUS_CONNECTION_STRING;
const entityName = process.env.SERVICEBUS_ENTITY_NAME;
const azureservicebus = {
    publish: async (message, userProperties = {}) => {
        const sbClient = new ServiceBusClient(connectionString);
        const sender = sbClient.createSender(entityName);
        let messageWrapper = {body: message, applicationProperties: userProperties}
        await sender.sendMessages(messageWrapper);
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
                deadLetterErrorDescription: message.deadLetterErrorDescription,
                enqueuedSequenceNumber: message.enqueuedSequenceNumber,
                enqueuedTimeUtc: message.enqueuedTimeUtc,
                applicationProperties: message.applicationProperties
            };
            return returnableMessage;            
        });
        return returnableMessages;
        
    },

    receive: async (type, subscription, isDeadLetter, limit) => {
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
        const fetchedMessages = await receiver.receiveMessages(limit)

        let completeP = fetchedMessages.map(m => receiver.completeMessage(m))
        await Promise.all(completeP)

        await receiver.close();
        await sbClient.close();
        const returnableMessages = fetchedMessages.map(message => {
            const returnableMessage = {
                messageId: message.messageId,
                body: message.body,
                deadLetterReason: message.deadLetterReason,
                deadLetterErrorDescription: message.deadLetterErrorDescription,
                enqueuedSequenceNumber: message.enqueuedSequenceNumber,
                enqueuedTimeUtc: message.enqueuedTimeUtc,
                applicationProperties: message.applicationProperties
            };
            return returnableMessage;            
        });
        return returnableMessages;
    },

    topicProperties: async (isRuntime) => {
        const sbAdmin = new ServiceBusAdministrationClient(connectionString);
        let info;
        if (isRuntime) {
            /** @type {import("@azure/service-bus").TopicRuntimeProperties} */
            info = await sbAdmin.getTopicRuntimeProperties(entityName);
            if (info.sizeInBytes) {
                let sizeInMegaBytes = info.sizeInBytes / (1024 * 1024);
                info.sizeInMegaBytes = sizeInMegaBytes;
            }

        } else {
            info = await sbAdmin.getTopic(entityName);
        }
        
        return info;
    },
    
    listSubscriptions: async (options = {}) => {
        const sbAdmin = new ServiceBusAdministrationClient(connectionString);
        let result = [];
        let subs;
        if (options.isRuntime) {
            subs = sbAdmin.listSubscriptionsRuntimeProperties(entityName);
        } else {
            subs = sbAdmin.listSubscriptions(entityName);
        }
        
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
    },

    createSubscription: async (subsName) => {
        const sbAdmin = new ServiceBusAdministrationClient(connectionString);
        const newSubscription = await sbAdmin.createSubscription(entityName, subsName);
        return newSubscription;
    },

    updateSubscription: async (subsObj) => {
        const sbAdmin = new ServiceBusAdministrationClient(connectionString);
        const updatedSubs = await sbAdmin.updateSubscription(subsObj);
        return updatedSubs;
    },

    deleteSubscription: async (subsName) => {
        const sbAdmin = new ServiceBusAdministrationClient(connectionString);
        await sbAdmin.deleteSubscription(entityName, subsName);
    },

    createRule: async (ruleName, subsName) => {
        const sbAdmin = new ServiceBusAdministrationClient(connectionString);
        const newRule = await sbAdmin.createRule(entityName, subsName, ruleName);
        return newRule;
    },

    updateRule: async (subsName, ruleObj) => {
        const sbAdmin = new ServiceBusAdministrationClient(connectionString);
        const updatedRule = await sbAdmin.updateRule(entityName, subsName, ruleObj);
        return updatedRule;
    }
}

module.exports = azureservicebus;