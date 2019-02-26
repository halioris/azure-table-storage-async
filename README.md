# azure-table-storage-async
Azure table storage API's that return promises to support async/await syntax.  This package was born primarily out of my desire to have an Azure Storage API for TableStorage that supported async/await syntax to avoid callback hell.

# Getting Started

## Install
```
npm install azure-table-storage-async
```
## Usage
```
var azureTS = require('azure-table-storage-async');
```
Many of the methods provided in the azure-storage npm package have been wrapped in this package to provide methods that
may be called using async/await syntax.  Many methods are named just like their counterparts in azure-storage and in general
they simply execute that method and return a promise (exceptions are noted).  There are additional methods provided that build
upon the azure-storage methods for additional capabilities.

## Methods

* [queryAllAsync](#queryallasynctablesvc-tablename)
* [queryPartitionAsync](#querypartitionasynctableavc-tablename-partitionname)
* [queryCustomAsync](#querycustomasynctablesvc-tablename-query)
* [queryEntitiesAsync](#queryentitiesasynctablesvc-table-query-cont)
* [retrieveEntityAsync](#retrieveentityasynctablesvc-table-partition-rowkey)
* [insertEntityAsync](#insertentityasynctablesvc-table-entity)
* [insertOrReplaceEntityAsync](#insertorreplaceentityasynctablesvc-table-entity)
* [replaceEntityAsync](#replaceentityasynctablesvc-table-entity)
* [deleteEntityAsync](#deleteentityasynctablesvc-table-entity)
* [createTableIfNotExistsAsync](#createtableifnotexistsasynctablesvc-table)
* [executeBatchAsync](#executebatchasynctablesvc-table-batch)
* [batchMerge](#batchmergetablesvc-table-list)
* [batchDelete](#batchdeletetablesvc-table-list)

### queryAllAsync(tableSvc, tableName)

Queries all entities from a table.  This is done by calling `queryEntitiesAsync` repeatedly with no partition until no continuation token is returned.

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| tableName | name of the table to query |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
const result = await azureTS.queryAllAsync(tableSvc, mytable);
// loop through results log the partition key and rowkey
for (let r of result) {
  console.log('PartitionKey = ' + r.PartitionKey._ + ' RowKey = ' + r.RowKey._);
}
```

### queryPartitionAsync(tableSvc, tableName, partitionName)

Queries all entities from a partition.  This is done by calling `queryEntitiesAsync` repeatedly for the specified partition until no continuation token is returned.

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| tableName | name of the table to query |
| partitionName | name of the partition to be queried |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var mypartition = 'The PartitionKey you want to query goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
const result = await azureTS.queryPartitionAsync(tableSvc, mytable, mypartition);
// loop through results log the row key
for (let r of result) {
  console.log('RowKey = ' + r.RowKey._);
}
```

### queryCustomAsync(tableSvc, tableName, query)

Executes a custom query defined in an azure-storage `TableQuery`.  This is done by calling `queryEntitiesAsync` repeatedly wiht the specified query until no continuation token is returned.

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| tableName | name of the table to query |
| query | an azure table query object created with a custom where clause, etc. |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var mypartition = 'The PartitionKey you want to query goes here';
var myattr1 = 'The value of attr1 to look for goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
// create a query to get entities from partition mypartition with attr1 = myattr1
const query = new azure.TableQuery().where('PartitionKey eq ? and attr1 == ?)', mypartition, myattr1);
const result = await azureTS.queryPartitionAsync(tableSvc, mytable, mypartition);
// loop through results log the row key and attr1
for (let r of result) {
  console.log('RowKey = ' + r.RowKey._ + ' attr1 = ' + r.attr1._);
}
```

### queryEntitiesAsync(tableSvc, table, query, cont)

Executes the azure-storage `queryEntities` method.

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| table | name of the table to query |
| query | query object |
| cont | continuation token |

### retrieveEntityAsync(tableSvc, table, partition, rowkey)

Executes the azure-storage `retrieveEntity` method

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| table | name of the table to query |
| partition | name of the partition to query |
| rowkey | RowKey of entity to be queried |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var mypartition = 'The PartitionKey you want to query goes here';
var myrowkey = 'The RowKey you want to query goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
const result = await azureTS.retrieveEntityAsync(tableSvc, mytable, mypartition, myrowkey);
// log attr1 from entity (any attribute from the entity)
console.log('attr1 = ' + result.attr1._);
```

### insertEntityAsync(tableSvc, table, entity)

Executes the azure-storage `insertEntity` method

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| table | name of the table to insert into |
| entity | the entity to be inserted |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var mypartition = 'The PartitionKey goes here';
var myrowkey = 'The RowKey goes here';
var myattr1 = 'The value of attr1 goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
var entGen = azure.TableUtilities.entityGenerator;
var myentity = {
      PartitionKey: entGen.String(mypartition),
      RowKey: entGen.String(myrowkey),
      attr1: entGen.String(myattr1)
    };
await azureTS.insertEntityAsync(tableSvc, mytable, myentity);
```

### insertOrReplaceEntityAsync(tableSvc, table, entity)

Executes the azure-storage `insertOrReplaceEntity` method

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| table | name of the table to insert/replace in |
| entity | the entity to be inserted or replaced |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var mypartition = 'The PartitionKey goes here';
var myrowkey = 'The RowKey goes here';
var myattr1 = 'The value of attr1 goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
var entGen = azure.TableUtilities.entityGenerator;
var myentity = {
      PartitionKey: entGen.String(mypartition),
      RowKey: entGen.String(myrowkey),
      attr1: entGen.String(myattr1)
    };
await azureTS.insertOrReplaceEntityAsync(tableSvc, mytable, myentity);
```

### replaceEntityAsync(tableSvc, table, entity)

Executes the azure-storage `replaceEntity` method

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| table | name of the table to update |
| entity | the entity to be replaced |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var mypartition = 'The PartitionKey goes here';
var myrowkey = 'The RowKey goes here';
var myattr1 = 'The value of attr1 goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
var entGen = azure.TableUtilities.entityGenerator;
var myentity = {
      PartitionKey: entGen.String(mypartition),
      RowKey: entGen.String(myrowkey),
      attr1: entGen.String(myattr1)
    };
await azureTS.replaceEntityAsync(tableSvc, mytable, myentity);
```

### deleteEntityAsync(tableSvc, table, entity)

Executes the azure-storage `deleteEntity` method

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| table | name of the table to delete from |
| entity | the entity to be deleted |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var mypartition = 'The PartitionKey goes here';
var myrowkey = 'The RowKey goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
var entGen = azure.TableUtilities.entityGenerator;
var myentity = {
      PartitionKey: entGen.String(mypartition),
      RowKey: entGen.String(myrowkey)
    };
await azureTS.deleteEntityAsync(tableSvc, mytable, myentity);
```

### createTableIfNotExistsAsync(tableSvc, table)

Executes the azure-storage `createTableIfNotExists` method

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| table | name of the table to check existence of and create if necessary |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
await azureTS.createTableIfNotExistsAsync(tableSvc, mytable);
```

### executeBatchAsync(tableSvc, table, batch)

Executes the azure-storage `executeBatch` method

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| table | name of the table the batch will operate against |
| batch | a batch object created using `azure-storage.TableBatch` |

### batchMerge(tableSvc, table, list)

Perform a batch merge on an array of entites.  The array may be as large as you would like as it will create batches of 100 as the azure-storage batch operations only support 100 entites at a time.

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| table | name of the table the batch will operate against |
| list | an array of entities to be merged into the table |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var mypartition = 'The PartitionKey goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
var entGen = azure.TableUtilities.entityGenerator;
// create 10 records to insert/merge in a batch
var mylist = [];
for (var i=0; i<10; i++) {
  mylist.push({
    PartitionKey: entGen.String(mypartition),
    RowKey: entGen.String(i)
  });
};
await azureTS.batchMerge(tableSvc, mytable, mylist);
```

### batchDelete(tableSvc, table, list)

Perform a batch delete on an array of entites.  The array may be as large as you would like as it will create batches of 100 as the azure-storage batch operations only support 100 entites at a time.

| Parameter | Description |
|---|---|
| tableSvc | table service object created using `azure-storage.createTableService` |
| table | name of the table the batch will operate against |
| list | an array of entities to be deleted from the table |

#### Example

```javascript
var azure = require('azure-storage');
var azureTS = require('azure-table-storage-async');
var accountname = 'Your azure account name goes here';
var accountkey = 'Your azure account key goes here';
var mytable = 'The table you want to query goes here';
var mypartition = 'The PartitionKey goes here';
var tableSvc = azure.createTableService(accountname, accountkey);
// query a partition and then delete all records queried in a batch
var result = await azureTS.queryPartitionAsync(tableSvc, mytable, mypartition);
await azureTS.batchDelete(tableSvc, mytable, result);
```
