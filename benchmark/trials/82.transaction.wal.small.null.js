'use strict';
require('../get-db')('insert-null', function (ourDb, theirDb) {
	ourDb.pragma('journal_mode = WAL');
	ourDb.pragma('synchronous = 1');
	theirDb.exec('PRAGMA journal_mode = WAL; PRAGMA synchronous = 1;', function () {
		require('../types/transaction')(ourDb, theirDb, 5000, null);
	});
});
