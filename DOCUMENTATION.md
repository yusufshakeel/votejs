# DOCUMENTATION.md

Table of contents

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


