import { createRxDatabase } from 'rxdb';
import {
    // getRxStorageSQLite,
    getSQLiteBasicsQuickSQLite,
    SQLiteBasics
} from 'rxdb/plugins/storage-sqlite';
import { open } from 'react-native-quick-sqlite';

const db = await createRxDatabase({
    name: 'mydatabase',
    storage: getRxStorageSQLite({
        sqliteBasics: getSQLiteBasicsQuickSQLite(open)
    }),
    multiInstance: false,
    ignoreDuplicate: true
});

function getRxStorageSQLite(arg0: { sqliteBasics: SQLiteBasics<any>; }): import("rxdb").RxStorage<any, any> {
    throw new Error('Function not implemented.');
}
