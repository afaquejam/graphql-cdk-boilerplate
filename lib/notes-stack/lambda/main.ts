import createNote from './createNote';
import Note = require('./Note');

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    noteId: string;
    note: Note;
  };
};

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case 'createNote':
      return await createNote(event.arguments.note);
    default:
      return null;
  }
};
