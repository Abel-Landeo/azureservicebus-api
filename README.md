# azureservicebus-api

## Description

The objective of this tool is to expose an API for managing the azure servicebus functionalities such as publishing a message, peeking messages from queues, topic subscriptions, or secondary queues such as DeadLetter queues, listing queues or topics, listing subscriptions of a specific topic, among other features.

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