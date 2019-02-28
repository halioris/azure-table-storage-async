'use strict';
var azure = require('azure-storage');

exports.queryAllAsync = function (tableSvc, tableName) {
    var completeList = [];
    return new Promise(async (resolve, reject) => {
        try {
            var entities = await exports.queryEntitiesAsync(tableSvc, tableName, null, null);
            completeList = completeList.concat(entities.entries);
            while (entities.continuationToken) {
                entities = await exports.queryEntitiesAsync(tableSvc, tableName, null, entities.continuationToken);
                completeList = completeList.concat(entities.entries);
            }
            resolve(completeList);
        } catch (error) {
            reject(error);
        }
    });
};

exports.queryPartitionAsync = async function (tableSvc, tableName, partitionName) {
    var completeList = [];
    var query = new azure.TableQuery().where('PartitionKey eq ?', partitionName); // in or out of the promise???
    return new Promise(async (resolve, reject) => {
        try {
            var entities = await exports.queryEntitiesAsync(tableSvc, tableName, query, null);
            completeList = completeList.concat(entities.entries);
            while (entities.continuationToken) {
                entities = await exports.queryEntitiesAsync(tableSvc, tableName, query, entities.continuationToken);
                completeList = completeList.concat(entities.entries);
            }
            resolve(completeList);
        }
        catch (error) {
            reject(error);
        }
    });
};

exports.queryCustomAsync = async function (tableSvc, tableName, query) {
    var completeList = [];
    return new Promise(async (resolve, reject) => {
        try {
            var entities = await exports.queryEntitiesAsync(tableSvc, tableName, query, null);
            completeList = completeList.concat(entities.entries);
            while (entities.continuationToken) {
                entities = await exports.queryEntitiesAsync(tableSvc, tableName, query, entities.continuationToken);
                completeList = completeList.concat(entities.entries);
            }
            resolve(completeList);
        }
        catch (error) {
            reject(error);
        }
    });
};

exports.queryEntitiesAsync = (tableSvc, table, query, cont) => {
    return new Promise((resolve, reject) => {
        tableSvc.queryEntities(table, query, cont, function (error, entities, response) {
            if (error) reject(error);
            else resolve(entities);
        });
    });
};

exports.retrieveEntityAsync = (tableSvc, table, partition, rowkey) => {
    return new Promise((resolve, reject) => {
        tableSvc.retrieveEntity(table, partition, rowkey, (error, result, response) => {
            if (error) {
                // don't return an error if entity is not found, just return a null result
                if (error.statusCode === 404) resolve(null);
                else reject(error);
            }
            else resolve(result);
        });
    });
};

exports.insertEntityAsync = (tableSvc, table, entity) => {
    return new Promise((resolve, reject) => {
        tableSvc.insertEntity(table, entity, (error, result, response) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

exports.insertOrReplaceEntityAsync = (tableSvc, table, entity) => {
    return new Promise((resolve, reject) => {
        tableSvc.insertOrReplaceEntity(table, entity, (error, result, response) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

exports.replaceEntityAsync = (tableSvc, table, entity) => {
    return new Promise((resolve, reject) => {
        tableSvc.replaceEntity(table, entity, (error, result, response) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

exports.deleteEntityAsync = (tableSvc, table, entity) => {
    return new Promise((resolve, reject) => {
        tableSvc.deleteEntity(table, entity, (error, response) => {
            if (error) reject(error);
            else resolve(null);
        });
    });
};

exports.createTableIfNotExistsAsync = (tableSvc, table) => {
    return new Promise((resolve, reject) => {
        tableSvc.createTableIfNotExists(table, function (error, result, response) {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

exports.doesTableExistAsync = (tableSvc, table) => {
    return new Promise((resolve, reject) => {
        tableSvc.doesTableExist(table, function (error, result, response) {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

exports.executeBatchAsync = (tableSvc, table, batch) => {
    return new Promise((resolve, reject) => {
        tableSvc.executeBatch(table, batch, function (error, result, response) {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

exports.batchMerge = (tableSvc, table, list) => {
    return new Promise(async (resolve, reject) => {
        try {
            var index = 0;
            var batch;
            for (let l of list) {
                index++;
                if (index % 100 === 1) batch = new azure.TableBatch();
                batch.insertOrMergeEntity(l);
                if (index % 100 === 0 || index === list.length) await exports.executeBatchAsync(tableSvc, table, batch);
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

exports.batchDelete = (tableSvc, table, list) => {
    return new Promise(async (resolve, reject) => {
        try {
            var index = 0;
            var batch;
            for (let l of list) {
                index++;
                if (index % 100 === 1) batch = new azure.TableBatch();
                batch.deleteEntity(l);
                if (index % 100 === 0 || index === list.length) await exports.executeBatchAsync(tableSvc, table, batch);
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};


