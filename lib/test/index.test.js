"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
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
    describe('goldwash', function () {
        it('exists', function () {
            chai_1.expect(typeof index_1.goldwash).to.equal('function');
        });
        it('throws if data is not an object or array', function () {
            var data = [undefined, null, true, "", 1, new Date(), /abc/, function () { return 1; }];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var i = data_1[_i];
                try {
                    index_1.goldwash(i, function () { return true; });
                }
                catch (er) {
                    chai_1.expect(er === undefined).to.equal(false);
                    continue;
                }
                chai_1.expect(true).to.equal(false);
            }
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
                e: [null, 2]
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
                            {
                                a: {
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
                            }],
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
        it('for keys that cant be outright deleted, will goldwash by trying to degrade to simpler values', function () {
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
                e: [null, 2]
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
    describe('goldwashAsync', function () {
        it('exists', function () {
            chai_1.expect(typeof index_1.goldwashAsync).to.equal('function');
        });
        it('rejects if data is not an object or array', function () { return __awaiter(_this, void 0, void 0, function () {
            var data, _i, data_2, i, er_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = [undefined, null, true, "", 1, /abc/, new Date(), function () { return 1; }];
                        _i = 0, data_2 = data;
                        _a.label = 1;
                    case 1:
                        if (!(_i < data_2.length)) return [3 /*break*/, 7];
                        i = data_2[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, index_1.goldwashAsync(i, function () { return Promise.resolve(true); })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        er_1 = _a.sent();
                        chai_1.expect(er_1 === undefined).to.equal(false);
                        return [3 /*break*/, 6];
                    case 5:
                        chai_1.expect(true).to.equal(false);
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        it('rejects if provided data does not pass test prior to any changes', function () { return __awaiter(_this, void 0, void 0, function () {
            var er_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, index_1.goldwashAsync({}, function () { return Promise.resolve(false); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        er_2 = _a.sent();
                        chai_1.expect(er_2 === undefined).to.equal(false);
                        return [2 /*return*/];
                    case 3:
                        chai_1.expect(true).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not modify initial data', function () { return __awaiter(_this, void 0, void 0, function () {
            var data, initialJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            a: 1,
                            b: '',
                            c: true,
                            d: undefined,
                            e: [1, 2, 3],
                            f: {}
                        };
                        initialJson = JSON.stringify(data);
                        return [4 /*yield*/, index_1.goldwashAsync(data, function () { return Promise.resolve(true); })];
                    case 1:
                        _a.sent();
                        chai_1.expect(JSON.stringify(data)).to.equal(initialJson);
                        return [2 /*return*/];
                }
            });
        }); });
        it('will goldwash an object by trying to delete keys recursively', function () { return __awaiter(_this, void 0, void 0, function () {
            var data, washedData, fnOfInterest, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            a: 1,
                            b: '',
                            c: true,
                            d: undefined,
                            e: [1, 2, 3],
                            f: {}
                        };
                        washedData = {
                            a: 1,
                            e: [null, 2]
                        };
                        fnOfInterest = function (d) {
                            return d.a + d.e[1];
                        };
                        return [4 /*yield*/, index_1.goldwashAsync(data, function (d) {
                                return Promise.resolve(fnOfInterest(d) === 3);
                            })];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
                        return [2 /*return*/];
                }
            });
        }); });
        it('during goldwash will go deep', function () { return __awaiter(_this, void 0, void 0, function () {
            var data, washedData, fnOfInterest, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            a: 1,
                            b: '',
                            c: {
                                a: 2,
                                b: {
                                    a: 8,
                                    b: [{ e: 5 },
                                        {
                                            a: {
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
                        washedData = {
                            a: 1,
                            c: {
                                b: {
                                    b: [null,
                                        {
                                            a: {
                                                a: 9
                                            }
                                        }],
                                }
                            }
                        };
                        fnOfInterest = function (d) {
                            return d.a + d.c.b.b[1].a.a;
                        };
                        return [4 /*yield*/, index_1.goldwashAsync(data, function (d) {
                                return Promise.resolve(fnOfInterest(d) === 10);
                            })];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
                        return [2 /*return*/];
                }
            });
        }); });
        it('for keys that cant be outright deleted, will goldwash by trying to degrade to simpler values', function () { return __awaiter(_this, void 0, void 0, function () {
            var data, washedData, fnOfInterest, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            a1: 200,
                            a2: 300,
                            b1: 'some string',
                            b2: 'some string',
                            c: true,
                            d: undefined,
                            e: [1, 2, 3],
                            f: {}
                        };
                        washedData = {
                            a1: 200,
                            a2: 0,
                            b2: " ",
                            e: [null, 2]
                        };
                        fnOfInterest = function (d) {
                            // conditions don't influence calculation, but keys need to be present
                            throwIf('a1' in d === false);
                            throwIf(typeof d.a2 !== 'number');
                            throwIf('b1' in d === false);
                            throwIf(d.b2.length === 0);
                            return d.a1 + d.e[1];
                        };
                        return [4 /*yield*/, index_1.goldwashAsync(data, function (d) {
                                return Promise.resolve(fnOfInterest(d) === 202);
                            })];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('centrifuge', function () {
        it('can separate data into base with primitive values set to default and actual test data', function () {
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
            var centrifugedData = {
                a1: 200,
                e: [null, 2]
            };
            var centrifugedBase = {
                a1: 0,
                a2: 0,
                b1: "",
                b2: "",
                c: false,
                d: undefined,
                e: [0, 0, 0],
                f: {}
            };
            var fnOfInterest = function (d) {
                // conditions don't influence calculation, but keys need to be present
                throwIf('a1' in d === false);
                throwIf(typeof d.a2 !== 'number');
                throwIf('b1' in d === false);
                throwIf(typeof d.b2 !== 'string');
                return d.a1 + d.e[1];
            };
            var _a = index_1.centrifuge(data, function (d) {
                return fnOfInterest(d) === 202;
            }), base = _a[0], result = _a[1];
            chai_1.expect(JSON.stringify(result)).to.equal(JSON.stringify(centrifugedData));
            chai_1.expect(JSON.stringify(base)).to.equal(JSON.stringify(centrifugedBase));
        });
    });
    describe('centrifugeAsync', function () {
        it('can separate data into base with primitive values set to default and actual test data', function () { return __awaiter(_this, void 0, void 0, function () {
            var data, centrifugedData, centrifugedBase, fnOfInterest, _a, base, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = {
                            a1: 200,
                            a2: 300,
                            b1: 'some string',
                            b2: 'some string',
                            c: true,
                            d: undefined,
                            e: [1, 2, 3],
                            f: {}
                        };
                        centrifugedData = {
                            a1: 200,
                            e: [null, 2]
                        };
                        centrifugedBase = {
                            a1: 0,
                            a2: 0,
                            b1: "",
                            b2: "",
                            c: false,
                            d: undefined,
                            e: [0, 0, 0],
                            f: {}
                        };
                        fnOfInterest = function (d) {
                            // conditions don't influence calculation, but keys need to be present
                            throwIf('a1' in d === false);
                            throwIf(typeof d.a2 !== 'number');
                            throwIf('b1' in d === false);
                            throwIf(typeof d.b2 !== 'string');
                            return d.a1 + d.e[1];
                        };
                        return [4 /*yield*/, index_1.centrifugeAsync(data, function (d) {
                                return Promise.resolve(fnOfInterest(d) === 202);
                            })];
                    case 1:
                        _a = _b.sent(), base = _a[0], result = _a[1];
                        chai_1.expect(JSON.stringify(result)).to.equal(JSON.stringify(centrifugedData));
                        chai_1.expect(JSON.stringify(base)).to.equal(JSON.stringify(centrifugedBase));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('tests from readme', function () {
        function blackboxRateCalulationFunction(data) {
            //50 line of calculations
            var preDiscountPrice = data.carProfile.inflationAdjustedPrice * data.carProfile.amotrization;
            //50 line of calculations
            var corporateDiscount = getCorporatePartnerBonus(data.renter.name, data.rentOptions.corporatePartner, data.rentOptions.duration);
            //50 line of calculations
            var longRenterDiscount = getBonusForLongRenters(data.renter.rentalHistory);
            //50 line of calculations
            var discount = data.renter.loyaltyBonus + corporateDiscount + longRenterDiscount;
            var simplePrice = preDiscountPrice / 360 * data.rentOptions.duration * (1 - discount);
            return {
                quiteSeasonPrice: 0,
                governmentPrice: 0,
                simplePrice: simplePrice,
            };
            function getCorporatePartnerBonus(name, partnerId, duration) {
                if (name.length > 3 && partnerId === 5 && duration === 3) {
                    return 0.05;
                }
                return 0;
            }
            function getBonusForLongRenters(history) {
                return history.some(function (h) { return h.duration >= 100; })
                    ? 0.02
                    : 0;
            }
        }
        var carRentalRequest = {
            renter: {
                name: "John Smith",
                loyaltyBonus: 0.07,
                rentalHistory: [
                    { duration: 10, price: 1500, dates: [ /**/] },
                    { duration: 20, price: 3000, dates: [ /**/] },
                    { duration: 105, price: 12000, dates: [ /**/] },
                ]
            },
            rentOptions: {
                duration: 3,
                corporatePartner: 5,
                bonusMilage: 1000
                //...20 more options
            },
            carProfile: {
                rawPrice: 15000,
                inflationAdjustedPrice: 17200,
                amotrization: 0.72,
                taxationPremium: 0.02,
                articleC20Rate: 0.03,
                bonusCoeficients: {
                    promo5for5: 0.12,
                    miles1000: 2,
                    coproratePartnership: 10,
                    rideTheBrand: 1.2,
                }
            }
        };
        it('simplePrice calclculation calculates correctly', function () {
            var result = blackboxRateCalulationFunction(carRentalRequest);
            chai_1.expect(result.simplePrice).to.equal(88.752);
        });
        it('simplePrice calclculation calculates correctly', function () {
            var goldwashedData = index_1.goldwash(carRentalRequest, function (data) {
                var result = blackboxRateCalulationFunction(data);
                return result.simplePrice === 88.752;
            });
            //console.log(JSON.stringify(goldwashedData));
        });
    });
});
//# sourceMappingURL=index.test.js.map