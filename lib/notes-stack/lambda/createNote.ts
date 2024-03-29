// lambda-fns/createNote.ts
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Note = require('./Note');

async function createNote(note: Note) {
  const params = {
    TableName: process.env.NOTES_TABLE,
    Item: note,
  };
  try {
    await docClient.put(params).promise();
    return note;
  } catch (err) {
    console.log('DynamoDB error: ', err);
    return null;
  }
}

export default createNote;
