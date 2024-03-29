# azureservicebus-api

## Description

The objective of this tool is to expose an API for managing the azure servicebus functionalities such as publishing a message, peeking messages from queues, topic subscriptions, or secondary queues such as DeadLetter queues, listing queues or topics, listing subscriptions of a specific topic, among other features.

## Instalation
### Locally
- Clone and cd the repo
- run "npm install"
- Set the following env variables: APP_PORT, SERVICEBUS_CONNECTION_STRING and SERVICEBUS_ENTITY_NAME
- Run "node app.js"

### Docker
- Clone and cd the repo
- run "docker build --tag <yourimagename>:<yourimageversion> ."
- run "docker run --env SERVICEBUS_CONNECTION_STRING=<your_azure_servicebus_connection> --env SERVICEBUS_ENTITY_NAME=<your_azure_servicebus_entityname> --env APP_PORT=<default_is_4500> --publish <hostPort>:<containerPort> <yourimagename>:<yourimageversion>"

## API interface

The base API rest is `/servicebus/v1/`

Azure servicebus has two main features:

1. **Admin client**: This client owns features like listing queues or subscription topics, also creates or deletes queues or topics as well. The API will use `/admin/**` for this group of features.

2. **Standard client**: This client owns features like publishing messages to a queue or topic, also peeks messages from a queue or subscription topic. The API will use `/standard/**` for this group of features.

### API Features:

Do not forget that it starts with the base API `/servicebus/v1`

- `POST /standard/publish`

The request body is the message to be published 
```json
{
    "key1": "val1",
    "key2": "val2",
    ...
}
```

The query params are used as application or user properties of the message
```
"userParameter1": "value1"
"userParameter2": "value2"
...
```

- `GET /standard/peek`
Query params:
```
"type": "<queue | topic>"
"subscription": "<name of the subscription in case it is a topic>"
"isdeadletter": <true | false>
"limit": <max to be peeked; if omitted, all messages will be peeked>
```

- `GET /standard/receive`

**Warning: Messages received are actually consumed from the topic/queue**

Query params:
```
"type": "<queue | topic>"
"subscription": "<name of the subscription in case it is a topic>"
"isdeadletter": <true | false>
"limit": <max to be fetched; if omitted, all messages will be fetched>
```

- `GET /admin`
-- retrieves the topic properties; config or runtime properties based on the runtime query param.
Query params:
```
"runtime": <true | false>,
```

- `GET /admin/entities`
Query params:
```
"runtime": <true | false>,
"entity": "<subscription | rule>",
"subscription": "<name of the subscription in case rules are to list>"
```

- `POST /admin/entities`
Create a specific entity (subscription, rule)
Request body:
```json
{
    "subscription": "subscription to be created or subscription of the rule to be created>",
    "rule": "rule to be created. If not present, the subscription will be created"    
}
```

- `PUT /admin/entities`
Update a specific entity (subscription, rule)

For updating a subscription:

Request body:
```json
{
    "subscriptionName": "existing_subs_name",
    "topicName": "existing_topic_name",
    "lockDuration": "string duration in ISO8601",
    "maxDeliveryCount": number,
    "requiresSession": boolean,
    "enableBatchedOperations": boolean,
    "defaultMessageTimeToLive": "string duration in ISO8601",
    "autoDeleteOnIdle": "string duration in ISO8601",
    "deadLetteringOnMessageExpiration": boolean,
    "deadLetteringOnFilterEvaluationExceptions": boolean,
    "status": "string",
    "availabilityStatus": "string"
}
```

For updating a rule:

Query param: "subscription"

Request body:
```json
{
    "name": "existing_rule_name",
    "filter": {
        "sqlExpression": "string sql expressions"
    },
    "action": {}
}
```

- `DELETE /admin/entities`
Query params:
```
"subscription": "<name of the subscription to be removed>"
```