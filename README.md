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

#### DB setup

First we need to create a database in Postgres. Then export the following environment variables.

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

#### Secret Key

Set the password hashing secret key as environment variable.
```
➜ export PASSWORD_HASHING_SECRET_KEY=this-is-my-secret-key
```

## License
It's free :smiley:

[MIT License](https://github.com/yusufshakeel/votejs/blob/master/LICENSE) Copyright (c) 2020 Yusuf Shakeel

#### Back this project

If you find this project useful and interesting then feel free to support me on [Patreon](https://www.patreon.com/yusufshakeel).

#### Donate
Feeling generous :smiley: [Donate via PayPal](https://www.paypal.me/yusufshakeel)
