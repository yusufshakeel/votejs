# DOCUMENTATION.md

## DOMAIN to DB contracts

This section talks about the JSON schema to be used in DOMAIN layer if we want to save them in DB layer.

### AUDIT

```json
{
  "audit": {
    "createdAt": "date-time",
    "updatedAt": "date-time"
  }
}
```

### COUNTRY

```json
{
  "countryCode": "string",
  "countryName": "string",
  "code": "string"
}
```

### ADMIN

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

### VOTER

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

### CANDIDATE

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

### TOPIC

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

### ELECTION

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

### ELECTION CANDIDATE

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

### ELECTION TOPIC

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

### VOTE CANDIDATE

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

### VOTE TOPIC

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


