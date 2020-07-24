# votejs
This is a voting application using NodeJS.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yusufshakeel/votejs)
[![npm version](https://img.shields.io/badge/npm-0.1.0-blue.svg)](https://www.npmjs.com/package/votejs)
[![Build Status](https://travis-ci.com/yusufshakeel/votejs.svg?branch=master)](https://travis-ci.com/yusufshakeel/votejs)

## Prerequisite

We will need the following to be installed on our system.

- Node v10 or above
- NPM v6 or above
- Postgres v10 or above

## Getting started

Run the following command to install all the packages.

```
➜ npm install
```

#### Environment

Set the environment by setting the environment variable `NODE_ENV`.

Allowed values: dev, stage, prod
```
➜ export NODE_ENV=dev
```

#### Encryption Key

Set the encryption key as environment variable. Make sure it is exactly 256 bits long (32 characters).
```
➜ export ENCRYPTION_KEY=crypto-key-exactly-32-chars-long
```
Note! Encryption algorithm used: `aes-256-cbc` and IV length is `16`.

#### Database setup

Create a database in Postgres. Then export the following environment variables.

On my local machine the host, user, password, database and port for Postgres are the following.

Note! If you have some other values then use that.
 
```
➜ export DB_HOST=localhost
➜ export DB_USER=
➜ export DB_PASSWORD=
➜ export DB_DATABASE=votejs
➜ export DB_PORT=5432
```

For more details check the [NOTES.md](./NOTES.md) file.

#### Seed

Run the following command to insert the seed data in database.
```
➜ npm run db:seed
```

#### Demo admin for DEV environment

For development environment the following demo admin account is created when you run the `db:seed` command.

You can use the demo admin to explore the APIs in dev environment.

```
{
  userName: 'demo.dev.admin',
  emailId: 'demo.dev.admin@example.com',
  password: 'root1234'
  passcode: '123456'
}
```


## License
It's free :smiley:

[MIT License](https://github.com/yusufshakeel/votejs/blob/master/LICENSE) Copyright (c) 2020 Yusuf Shakeel

#### Back this project

If you find this project useful and interesting then feel free to support me on [Patreon](https://www.patreon.com/yusufshakeel).

#### Donate
Feeling generous :smiley: [Donate via PayPal](https://www.paypal.me/yusufshakeel)
