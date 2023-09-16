import Dexie from 'dexie';

const db = new Dexie('YourAppDatabase');

function openUserDatabase(userId) {
  return db.version(5).stores({
    [userId]: '++id, name',
  }).open();
}

function addDataToUserDatabase(userId, data) {
  return openUserDatabase(userId).then(() => {
    return db[userId].add(data);
  });
}

function getDataFromUserDatabase(userId) {
  return openUserDatabase(userId).then(() => {
    return db[userId].toArray();
  });
}

export { addDataToUserDatabase, getDataFromUserDatabase };
