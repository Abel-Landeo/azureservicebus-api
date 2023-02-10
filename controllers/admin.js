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
        if (request.rule) {
            createdEntity = await servicebus.createRule(request.rule, request.subscription);
        } else {
            createdEntity = await servicebus.createSubscription(request.subscription);            
        }
        res.status(201).json(createdEntity);
    } catch (error) {
        next(error);
    }
}

const putEntities = async (req, res, next) => {
    try {
        let entityObj = req.body;
        let updatedEntity = {};
        if (req.query.subscription) {
            updatedEntity = await servicebus.updateRule(req.query.subscription, entityObj);
        } else {
            updatedEntity = await servicebus.updateSubscription(entityObj);
        }
        res.status(200).json(updatedEntity);
    } catch (error) {
        next(error);
    }
}

const get = async (req, res, next) => {
    try {
        let params = req.query;
        params.runtime = params.runtime || "false";
        let isRuntime = params.runtime.toLowerCase() === 'true';
        const info = await servicebus.namespaceProperties(isRuntime);
        res.json(info);        
    } catch (error) {
        next(error);        
    }
}

module.exports = {
    getEntities,
    postEntities,
    putEntities,
    get
}