// mongodb driver
const MongoClient = require("mongodb").MongoClient;
const dbConnectionUrl = "mongodb+srv://@cluster0-kka98.gcp.mongodb.net/test?retryWrites=true&w=majority";

function initialize(
    dbName: any,
    dbCollectionName: any,
    successCallback: any,
    failureCallback: any
) {
    MongoClient.connect(dbConnectionUrl, function (err: any, dbInstance: any) {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err); // this should be "caught" by the calling function
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            successCallback(dbCollection);
        }
    });
}

export { initialize };
