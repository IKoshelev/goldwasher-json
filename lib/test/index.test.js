"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("./../src/index");
var delay = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
function throwIf(cond) {
    if (cond) {
        throw new Error("something wrong");
    }
}
describe('goldwasher-json ', function () {
    it('exists', function () {
        chai_1.expect(typeof index_1.goldwash).to.equal('function');
    });
    it('throws if data is not an object or array', function () {
        [undefined, null, true, "", 1, new Date(), function () { }]
            .forEach(function (i) {
            try {
                index_1.goldwash(i, function () { return false; });
            }
            catch (er) {
                chai_1.expect(er === undefined).to.equal(false);
                return;
            }
            chai_1.expect(true).to.equal(false);
        });
    });
    it('throws if provided data does not pass test prior to any changes', function () {
        try {
            index_1.goldwash({}, function () { return false; });
        }
        catch (er) {
            chai_1.expect(er === undefined).to.equal(false);
            return;
        }
        chai_1.expect(true).to.equal(false);
    });
    it('does not modify initial data', function () {
        var data = {
            a: 1,
            b: '',
            c: true,
            d: undefined,
            e: [1, 2, 3],
            f: {}
        };
        var initialJson = JSON.stringify(data);
        index_1.goldwash(data, function () { return true; });
        chai_1.expect(JSON.stringify(data)).to.equal(initialJson);
    });
    it('will goldwash an object by trying to delete keys recursively', function () {
        var data = {
            a: 1,
            b: '',
            c: true,
            d: undefined,
            e: [1, 2, 3],
            f: {}
        };
        var washedData = {
            a: 1,
            e: [null, 2, null]
        };
        var fnOfInterest = function (d) {
            return d.a + d.e[1];
        };
        var result = index_1.goldwash(data, function (d) {
            return fnOfInterest(d) === 3;
        });
        chai_1.expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
    });
    it('during goldwash will go deep', function () {
        var data = {
            a: 1,
            b: '',
            c: {
                a: 2,
                b: {
                    a: 8,
                    b: [{ e: 5 },
                        { a: {
                                a: 9
                            }
                        },
                        {
                            a: 1,
                            b: 8
                        }],
                    c: 'a'
                },
                c: 5
            },
            f: {}
        };
        var washedData = {
            a: 1,
            c: {
                b: {
                    b: [null,
                        {
                            a: {
                                a: 9
                            }
                        },
                        null],
                }
            }
        };
        var fnOfInterest = function (d) {
            return d.a + d.c.b.b[1].a.a;
        };
        var result = index_1.goldwash(data, function (d) {
            return fnOfInterest(d) === 10;
        });
        chai_1.expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
    });
    it('for keys that cant be outright deleted, will goldwashing by trying to degrade to simpler values', function () {
        var data = {
            a1: 200,
            a2: 300,
            b1: 'some string',
            b2: 'some string',
            c: true,
            d: undefined,
            e: [1, 2, 3],
            f: {}
        };
        var washedData = {
            a1: 200,
            a2: 0,
            b2: " ",
            e: [null, 2, null]
        };
        var fnOfInterest = function (d) {
            // conditions don't influence calculation, but keys need to be present
            throwIf('a1' in d === false);
            throwIf(typeof d.a2 !== 'number');
            throwIf('b1' in d === false);
            throwIf(d.b2.length === 0);
            return d.a1 + d.e[1];
        };
        var result = index_1.goldwash(data, function (d) {
            return fnOfInterest(d) === 202;
        });
        chai_1.expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
    });
});
//# sourceMappingURL=index.test.js.map