"use strict";

var _app = _interopRequireDefault(require("../app"));

var _supertest = _interopRequireDefault(require("supertest"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

describe("app", function () {
  var server;
  beforeEach(function () {
    server = _app["default"].listen();
  });
  afterEach(function () {
    server.close();
  });
  test("should start the server and listen on the specified port", function _callee() {
    var response;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(
              (0, _supertest["default"])(server).get("/"),
            );

          case 2:
            response = _context.sent;
            expect(response.status).toBe(200);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  test("should return a 404 for non-existent routes", function _callee2() {
    var response;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(
              (0, _supertest["default"])(server).get("/non-existent"),
            );

          case 2:
            response = _context2.sent;
            expect(response.status).toBe(404);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
});
