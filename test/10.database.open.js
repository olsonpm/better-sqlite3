var expect = require('chai').expect;
var fs = require('fs');
var Database = require('../.');
var util = (function () {
	var path = require('path');
	var dbId = 0;
	var obj;
	return obj = {
		current: function () {
			return 'temp/' + path.basename(__filename).split('.')[0] + '.' + dbId + '.db';
		},
		next: function () {++dbId; return obj.current();}
	};
}());

describe('new Database()', function () {
	it('should throw an exception when file path is not a string', function () {
		expect(function () {new Database();}).to.throw(TypeError);
		expect(function () {new Database(null);}).to.throw(TypeError);
		expect(function () {new Database(0);}).to.throw(TypeError);
		expect(function () {new Database(123);}).to.throw(TypeError);
		expect(function () {new Database(new String(util.next()));}).to.throw(TypeError);
		expect(function () {new Database(function () {});}).to.throw(TypeError);
		expect(function () {new Database([util.next()]);}).to.throw(TypeError);
	});
	it('should throw an exception when file path is empty', function () {
		expect(function () {new Database('');}).to.throw(TypeError);
	});
	it('should not allow URI file paths', function () {
		expect(function () {new Database('file:' + util.next());}).to.throw(TypeError);
		expect(function () {new Database('file:' + util.next() + '?mode=memory&cache=shared');}).to.throw(TypeError);
	});
	it('should not allow ":memory:" databases', function () {
		expect(function () {new Database(':memory:');}).to.throw(TypeError);
	});
	it('should allow disk-based databases to be created', function () {
		expect(function () {fs.accessSync(util.next());}).to.throw(Error);
		var db = new Database(util.current());
		expect(db.name).to.equal(util.current());
		expect(db.memory).to.be.false;
		expect(db.open).to.be.true;
		fs.accessSync(util.current());
	});
	it('should allow in-memory databases to be created', function () {
		expect(function () {fs.accessSync(util.next());}).to.throw(Error);
		var db = new Database(util.current(), {memory: true});
		expect(db.name).to.equal(util.current());
		expect(db.memory).to.be.true;
		expect(db.open).to.be.true;
		expect(function () {fs.accessSync(util.current());}).to.throw(Error);
	});
	it('should throw an Error if opening the database failed', function () {
		expect(function () {fs.accessSync(util.next());}).to.throw(Error);
		expect(function () {new Database('temp/nonexistent/abcfoobar123/' + util.current());})
		expect(function () {fs.accessSync(util.current());}).to.throw(Error);
	})
	it('should have a proper prototype chain', function () {
		var db = new Database(util.next());
		expect(db).to.be.an.instanceof(Database);
		expect(db.constructor).to.equal(Database);
		expect(Database.prototype.constructor).to.equal(Database);
		expect(Database.prototype.close).to.be.a('function');
		expect(Database.prototype.close).to.equal(db.close);
	});
});
