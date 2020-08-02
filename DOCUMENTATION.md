# DOCUMENTATION.md

Table of contents

* [Three layers](#three-layers)
  * [API](#api-layer)
  * [Domain](#domain-layer)
  * [Db](#db-layer)
* [DOMAIN to DB contracts](#domain-to-db-contracts)
  * [Audit](#audit-domain-to-db)
  * [Country](#country-domain-to-db)
  * [Admin](#admin-domain-to-db)
  * [Voter](#voter-domain-to-db)
  * [Candidate](#candidate-domain-to-db)
  * [Topic](#topic-domain-to-db)
  * [Election](#election-domain-to-db)
  * [Election Candidate](#election-candidate-domain-to-db)
  * [Election Topic](#election-topic-domain-to-db)
  * [Vote Candidate](#vote-candidate-domain-to-db)
  * [Vote Topic](#vote-topic-domain-to-db)

## Three layers

The project is divided into three layers.

* API layer
* Domain layer
* DB layer

```
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

         request
       --------->        --------->          --------->
WORLD               API              DOMAIN              DB
       <---------        <---------          <---------
        response

xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### API layer

This layer consists of APIs that are exposed to the world.
It receives requests and passes them to the Domain layer.
It passes the response from the Domain layer to the world.

### Domain layer

This layer receives requests from the API layer and passes it to the DB layer. On receiving response from the DB layer
it passes that to the API layer. This layer also deals with request/response validation.

### DB layer

This layer interacts with the database.

## DOMAIN to DB contracts

This section talks about the JSON schema to be used in DOMAIN layer if we want to save them in DB layer.

### AUDIT (domain to db)

```json
{
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```

### COUNTRY (domain to db)

```json
{
  "countryCode": "string",
  "countryName": "string",
  "code": "string"
}
```

### ADMIN (domain to db)

```json
{
  "guid": "uuid",
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "emailId": "string",
  "userName": "string",
  "password": "string",
  "passcode": "string",
  "accountStatus": "string",
  "gender": "string",
  "countryCode": "string",
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```

### VOTER (domain to db)

```json
{
  "guid": "uuid",
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "emailId": "string",
  "userName": "string",
  "password": "string",
  "passcode": "string",
  "accountStatus": "string",
  "gender": "string",
  "countryCode": "string",
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```

### CANDIDATE (domain to db)

```json
{
  "guid": "uuid",
  "candidateHandle": "string",
  "displayHeader": "string",
  "summary": "string",
  "candidateStatus": "string",
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```

### TOPIC (domain to db)

```json
{
  "guid": "uuid",
  "title": "string",
  "summary": "string",
  "topicStatus": "string",
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```

### ELECTION (domain to db)

```json
{
  "guid": "uuid",
  "title": "string",
  "summary": "string",
  "startsAt": "date-time",
  "endsAt": "date-time",
  "voteOn": "string",
  "electionStatus": "string",
  "electionSettings": {
    "voter": {
      "totalNumberOfVotesAllowed": "number",
      "isVoteDeletingAllowed": "boolean",
      "isVoteRevertingAllowed": "boolean"
    }
  },
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```

### ELECTION CANDIDATE (domain to db)

```json
{
  "guid": "uuid",
  "electionGuid": "uuid",
  "candidateGuid": "uuid",
  "electionCandidateStatus": "string",
  "candidateDisplayHeader": "string",
  "candidateHandle": "string",
  "candidateSummary": "string",
  "candidateStatus": "string",
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```

### ELECTION TOPIC (domain to db)

```json
{
  "guid": "uuid",
  "electionGuid": "uuid",
  "topicGuid": "uuid",
  "electionTopicStatus": "string",
  "topicTitle": "string",
  "topicSummary": "string",
  "topicStatus": "string",
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```

### VOTE CANDIDATE (domain to db)

```json
{
  "guid": "uuid",
  "electionGuid": "uuid",
  "candidateGuid": "uuid",
  "voterGuid": "uuid",
  "voteStatus": "string",
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```

### VOTE TOPIC (domain to db)

```json
{
  "guid": "uuid",
  "electionGuid": "uuid",
  "topicGuid": "uuid",
  "voterGuid": "uuid",
  "voteStatus": "string",
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```


