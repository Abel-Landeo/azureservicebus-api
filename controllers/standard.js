const servicebus = require('../services/azureservicebus');

const postPublish = async (req, res, next) => {
    try {
        let body = req.body;
        await servicebus.publish(body);
        res.json({
            status: "Ok",
            message: "Message published successfully"
        });
    } catch (error) {
        next(error);
    }
    
}

const getPeek = async (req, res, next) => {
    try {
        let params = req.query;
        let limit = parseInt(params.limit, 10);
        const peekedMessages = await servicebus.peek(params.type, params.subscription, params.isdeadletter, limit);
        res.json(peekedMessages);
    } catch (error) {
        next(error);
    }

}

module.exports = {
    postPublish,
    getPeek
}