# azure-table-storage-async
Azure table storage API's that return promises to support async/await syntax

Functions currently provided:

queryAllAsync(tableSvc, tableName)

queryPartitionAsync(tableSvc, tableName, partitionName)

queryCustomAsync(tableSvc, tableName, query)

queryEntitiesAsync(tableSvc, table, query, cont)

retrieveEntityAsync(tableSvc, table, partition, rowkey)

insertEntityAsync(tableSvc, table, entity)

insertOrReplaceEntityAsync(tableSvc, table, entity)

replaceEntityAsync(tableSvc, table, entity)

deleteEntityAsync(tableSvc, table, entity)

executeBatchAsync(tableSvc, table, batch)

batchMerge(tableSvc, table, list)

batchDelete(tableSvc, table, list)
