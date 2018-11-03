var request = require("supertest");
var assert = require('assert');

describe('array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});

describe('routes', function () {
  var server;

  beforeEach(function () {
    // Clears the cache so a new server instance is used for each test.
    delete require.cache[require.resolve('../app')];
    server = require("../app");
  });

  afterEach(function () {
    server.close();
  });

  // Test to make sure URLs respond correctly.
  it("url /", function (done) {
    request(server)
      .get("/")
      .end(function (err, res) {
        assert.equal(res.text, "Hello World!\n");
        done();
      });
  });
});