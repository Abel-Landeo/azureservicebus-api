const servicebus = require('../services/azureservicebus');

const getList = async (req, res, next) => {
    try {
        let params = req.query;
        let entities = [];
        if (params.entity === 'subscription') {
            entities = await servicebus.listSubscriptions();                                    
        }else if (params.entity === 'rule') {
            entities = await servicebus.listRules(params.subscription);
        }

        res.json({
            status: "ok",
            entities: entities
        })        
    } catch (error) {
        next(error);
    }
    
}

module.exports = {
    getList
}