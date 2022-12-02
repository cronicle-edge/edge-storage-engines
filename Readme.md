



# Custom storage plugins for cronicle

## Instalation

Option 1: \
Add SQL.js, Sftp.js, Level.js, Lmdb.js under \
```node_modules/pixl-server-storage/engines/``` \
then install dependencies (see below).

Option 2: \
To avoid touching cronicle installation:
- specify "engine_path" property under "Storage" in config file. Use absolute path to avoid errors. E.g.:
```json
	"Storage": {
		"engine": "Sftp",
                "engine_path": "/tmp/edge-storage-engines/Sftp.js",
		...
		},
```
- install dependencies globally. May need to specify NODE_PATH variable, to let node to resolve global packages properly. 

```export NODE_PATH=$(npm root --quiet -g)```


## SFTP
```bash
  npm i ssh2-sftp-client
```

###  config:
```json
	"Storage": {
		"engine": "Sftp",
		"list_page_size": 50,
		"concurrency": 4,
		"log_event_types": { "get": 1, "put": 1, "head": 1,	"delete": 1, "expire_set": 1 },
		"Sftp": {
			"base_dir": "data",
			"key_namespaces": 1,
			"connection": {
				"host": "192.168.0.1",
				"port": 22,
				"username": "root",
				"password": "P@ssword"
			}
		}
	},
```


## Embedded KV stores
```bash
  npm i lmdb ## for lmdb
  npm i level ### for level db
```
###  config:
```json
	"Storage": {
		"engine": "Lmdb",
		"list_page_size": 50,
		"concurrency": 4,
		"log_event_types": { "get": 1, "put": 1, "head": 1,	"delete": 1, "expire_set": 1 },
        "Lmdb": { "dbpath":"data-lmdb", "compression":true }       
    },
```
```json
	"Storage": {
		"engine": "Level",
		"list_page_size": 50,
		"concurrency": 4,
		"log_event_types": { "get": 1, "put": 1, "head": 1,	"delete": 1, "expire_set": 1 },
        "Level": { "dbpath":"data-level"}       
    },
```

## SQL 
Please note that this plugin will create destination table automatically (if not exists). To create the table beforehand refer to SQLExamples/DDL.sql to find proper DDL statement for your DB driver.

### dependencies
```bash
  npm i knex # ORM tool, mandatory

  npm i sqlite3 ### for SQLite
  npm i mysql2  ### for MySQL
  npm i pg  ### for Postgres
  npm i oracledb  ### for Oracle
  npm i tedious  ### for MSSQL
```
###  sqlite:
```json
	"Storage": {
		"engine": "SQL",
		"list_page_size": 50,
		"concurrency": 4,
		"log_event_types": { "get": 1, "put": 1, "head": 1,	"delete": 1, "expire_set": 1 },
		"SQL": {
			"client": "sqlite3",
			"table": "cronicle",
			"useNullAsDefault": true,
			"connection": {
				"filename": "/tmp/cronicle.db"
			}
		}
	}
```
### MySQL 
```json
		"SQL": {
			"client": "mysql2",
			"table": "cronicle",
			"connection": {
				"host": "localhost",
				"user": "dbUser",
				"password": "dbPassword",
				"database": "dbName"
			}
		}
```
### Postgres
```json
		"SQL": {
			"client": "pg",
			"table": "cronicle",
			"connection": {
				"host": "localhost",
				"user": "dbUser",
				"password": "dbPassword",
				"database": "dbName"
			}
		}
```
### MSSQL
```json
		"SQL": {
			"client": "mssql",
			"table": "cronicle",
			"connection": {
				"host": "localhost",
				"user": "dbUser",
				"password": "dbPassword",
				"database": "dbName"
			}
		}
```
## Oracle
Please note, in order to use oracle you will also need to install Oracle's instant client. To install on alpine follow this Dockerfile:
https://github.com/Shrinidhikulkarni7/OracleClient_Alpine/blob/master/Dockerfile
```json
		"SQL": {
			"client": "pg",
			"table": "cronicle",
			"connection": {
                        "connectString": "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost...)))",
				"user": "dbUser",
				"password": "dbPassword",
				"database": "oracleSchema"
			}
		}
```
