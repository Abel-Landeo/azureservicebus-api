const servicebus = require('../services/azureservicebus');

const getEntities = async (req, res, next) => {
    try {
        let params = req.query;
        params.runtime = params.runtime || "false";
        let entities = [];
        if (params.entity === 'subscription') {
            entities = await servicebus.listSubscriptions({
                isRuntime: ( params.runtime.toLowerCase() === 'true' )
            });
        }else if (params.entity === 'rule') {
            entities = await servicebus.listRules(params.subscription);
        }

        res.json({
            total: entities.length,
            entities: entities
        })        
    } catch (error) {
        next(error);
    }
    
}

const postEntities = async (req, res, next) => {
    try {
        let request = req.body;
        let createdEntity = {};
        if (request.entityType === 'subscription') {
            createdEntity = await servicebus.createSubscription(request.entityName, request.options);
        } else if(request.entityType === 'rule') {
            createdEntity = await servicebus.createRule(request.subscription, request.entityName, request.options );
        }
        res.status(201).json(createdEntity);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getEntities,
    postEntities
}