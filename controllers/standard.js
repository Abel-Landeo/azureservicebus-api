const servicebus = require('../services/azureservicebus');

const postPublish = async (req, res, next) => {
    try {
        let body = req.body;
        await servicebus.publish(body.message, body.name);
        res.json({
            status: "Ok",
            message: "Message published successfully"
        });
    } catch (error) {
        next(error);
    }
    
}

module.exports = {
    postPublish
}