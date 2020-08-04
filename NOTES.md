### Install
To install all the dependencies and start developing/using run the following command.
```
> npm install
``` 

### Test
To run the test suite execute the following command.
```
> npm run test
```

### JSDocs
To generate JS Documentation run the following command.
```
> npm run generate-docs
```

### Precommit
Run the following command before making Git Commit.
```
> npm run precommit
```
This will generate documentation, run test suites and any other steps that you have configures in the `package.json` file.

### Update the version in package.json
Run the following command to update the version of the project in `package.json` file.
```
> npm version VERSION
```
Example:
```
> npm version 1.0.0
```

### Configurations
Configurations are saved inside the `config` directory.
- `config/default.json` contains the default configurations.
- `config/custom-environment-variables.json` contains the custom configurations.

### DB Migrations
The db migration files are stored inside the `migrations` directory.

The configurations of the migrations are inside the `database.json` file.

Run the following to create a new migration file.
```
> npm run dbmigrate:create fileName
```

Reference: [db-migrate Documentation](https://db-migrate.readthedocs.io/en/latest/) 

### DB reset generate
Run the following command to hard reset i.e. remove all the data and re-initialise the tables with seed data.

```
> npm run db:reset-generate
```