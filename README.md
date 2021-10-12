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
```json
{
    "key1": "val1",
    "key2": "val2",
    ...
}
```

- `GET /standard/peek`
Query params:
```
"type": "<queue | topic>"
"subscription": "<name of the subscription in case it is a topic>"
"isdeadletter": <true | false>
"limit": <max to be peeked; if omitted, all messages will be peeked>
```

- `GET /admin/list`
Query params:
```
"entity": "<subscription | rule>",
"subscription": "<name of the subscription in case rules are to list>"
```


