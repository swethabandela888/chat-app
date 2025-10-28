const { Counter } = require( '../models/message')

async function getNextId( id) {
    let result = await Counter.findOneAndUpdate(
        { 'id': id }, // 'user_id', 'chat_id' 
        { '$inc': { 'count' : 1}  } ,
        { 'new': true, 'upsert': true }   
    )
    return result.count;
}

module.exports = getNextId;


