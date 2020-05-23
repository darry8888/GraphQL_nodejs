import { IResolvers } from 'graphql-tools';

// << db setup >>
import { initialize } from './db';
const dbName = 'data';
const collectionName = 'sample';

let mdb = '';
// << db init >>
initialize(dbName, collectionName, function (dbCollection: any) { // successCallback
    // get all items
    dbCollection.find().toArray(function (err: any, result: any) {
        if (err) throw err;
        console.log(result);
        mdb = JSON.stringify(result);
    });

    // << db CRUD routes >>

}, function (err: any) { // failureCallback
    throw (err);
});

const users = [
    { id: 1, name: 'Fong', age: 23, friendIds: [2, 3], height: 170, weight: 67 },
    { id: 2, name: 'Kevin', age: 40, friendIds: [1], height: 160, weight: 47 },
    { id: 3, name: 'Mary', age: 18, friendIds: [1], height: 180, weight: 87 }
];

const resolverMap: IResolvers = {
    Query: {
        hello:(): string => {
            return `👋 Hello world!, good 👋 ${mdb}`;
        },
        me:() => users[0],
        users:() => users,
        user:(parent, args, context) => {
            const { id } = args;
            return users.find(user => user.id === id);
        }
    },
    User: {
        // 每個 Field Resolver 都會預設傳入三個參數，
        // 分別為上一層的資料 (即 user)、參數 (下一節會提到) 以及 context (全域變數)
        friends: (parent, args, context) => {
            // 從 user 資料裡提出 friendIds
            const { friendIds } = parent;
            // Filter 出所有 id 出現在 friendIds 的 user
            return users.filter(user => friendIds.includes(user.id));
        },
        height: (parent, args) => {
            const { unit } = args;
            if (unit === "CENTIMETRE") return parent.height;
            else if (unit === "METRE") return parent.height / 100;
            else if (unit === "FOOT") return parent.height / 30.48;
            throw new Error(`Height unit "${unit}" not supported.`);
        },
        weight: (parent, args) => {
            const { unit } = args;
            if (unit === "KILOGRAM") return parent.height;
            else if (unit === "GRAM") return parent.height * 100;
            else if (unit === "POUND") return parent.height / 0.45359237;
            throw new Error(`Weight unit "${unit}" not supported.`);
        },
    }
};
export default resolverMap;  

/**
 * 
 * antonyMongoDB
adminAntony0000
query allCourse($id: Int!){
  hello
  users{
    ...uData
    weight
    height
  }
  user1: user(id: $id){
    ...uData
  }
  user2: user(id: 1){
    ...uData
    weight(unit: POUND)
    height(unit: FOOT)
  }
}

fragment uData on User {
  id
  name
  age
}
-----
variables
{
  "id": 2
}

 */