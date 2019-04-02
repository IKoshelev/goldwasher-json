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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
function goldwash(initial, testFn) {
    throwIfNotObject(initial);
    var data = lodash_1.default.cloneDeep(initial);
    var initialTest = testFn(data);
    if (!initialTest) {
        throwInitialTestNotPassing();
    }
    pruneKeys(data, data, function (currentData) { return currentData; }, testFn);
    degradePrimitiveValues(data, data, function (currentData) { return currentData; }, testFn);
    return data;
}
exports.goldwash = goldwash;
function goldwashAsync(initial, testFn) {
    return __awaiter(this, void 0, void 0, function () {
        var data, initialTest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    throwIfNotObject(initial);
                    data = lodash_1.default.cloneDeep(initial);
                    return [4 /*yield*/, testFn(data)];
                case 1:
                    initialTest = _a.sent();
                    if (!initialTest) {
                        throwInitialTestNotPassing();
                    }
                    return [4 /*yield*/, pruneKeysAsync(data, data, function (currentData) { return currentData; }, testFn)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, degradePrimitiveValuesAsync(data, data, function (currentData) { return currentData; }, testFn)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.goldwashAsync = goldwashAsync;
function centrifuge(initial, testFn) {
    throwIfNotObject(initial);
    var data = lodash_1.default.cloneDeep(initial);
    var initialTest = testFn(data);
    if (!initialTest) {
        throwInitialTestNotPassing();
    }
    var base = getCloneWithPrimitiveValuesSetToDefaults(data);
    var mergeCurrentDataIntoBase = function (currentData) {
        return lodash_1.default.merge({}, base, currentData);
    };
    pruneKeys(data, data, mergeCurrentDataIntoBase, testFn);
    degradePrimitiveValues(data, data, mergeCurrentDataIntoBase, testFn);
    return [base, data];
}
exports.centrifuge = centrifuge;
function centrifugeAsync(initial, testFn) {
    return __awaiter(this, void 0, void 0, function () {
        var data, initialTest, base, mergeCurrentDataIntoBase;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    throwIfNotObject(initial);
                    data = lodash_1.default.cloneDeep(initial);
                    return [4 /*yield*/, testFn(data)];
                case 1:
                    initialTest = _a.sent();
                    if (!initialTest) {
                        throwInitialTestNotPassing();
                    }
                    base = getCloneWithPrimitiveValuesSetToDefaults(data);
                    mergeCurrentDataIntoBase = function (currentData) {
                        return lodash_1.default.merge({}, base, currentData);
                    };
                    return [4 /*yield*/, pruneKeysAsync(data, data, mergeCurrentDataIntoBase, testFn)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, degradePrimitiveValuesAsync(data, data, mergeCurrentDataIntoBase, testFn)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, [base, data]];
            }
        });
    });
}
exports.centrifugeAsync = centrifugeAsync;
function throwInitialTestNotPassing() {
    throw new Error('Initial goldwash (before any changes were made ' +
        'to value provide) returned false. Test or data is invalid.');
}
function throwIfNotObject(initial) {
    if (!initial
        || typeof initial != 'object'
        || lodash_1.default.isDate(initial)
        || lodash_1.default.isRegExp(initial)) {
        throw new Error('Initial data must be an object (or array)');
    }
}
function getKeys(val) {
    return lodash_1.default(val).keys().value();
}
function pruneKeys(root, currentBranch, pretestTransformtaion, testFn) {
    var keys = getKeys(currentBranch);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var val = currentBranch[key];
        var res = false;
        try {
            delete currentBranch[key];
            var transfomedData = pretestTransformtaion(root);
            res = testFn(transfomedData);
        }
        catch (er) {
            res = false;
        }
        if (res === true) {
            continue;
        }
        currentBranch[key] = val;
    }
    if (lodash_1.default.isArray(currentBranch)) {
        while (!lodash_1.default(currentBranch).last()) {
            var res = false;
            var val = lodash_1.default(currentBranch).last();
            if (val !== null && val !== undefined) {
                break;
            }
            try {
                val = currentBranch.pop();
                var transfomedData = pretestTransformtaion(root);
                res = testFn(transfomedData);
            }
            catch (er) {
                res = false;
            }
            if (res !== true) {
                currentBranch.push(val);
                break;
            }
        }
    }
    var surviverKeys = getKeys(currentBranch);
    for (var _a = 0, surviverKeys_1 = surviverKeys; _a < surviverKeys_1.length; _a++) {
        var key = surviverKeys_1[_a];
        var surviverValue = currentBranch[key];
        if (lodash_1.default.isObjectLike(surviverValue)) {
            pruneKeys(root, surviverValue, pretestTransformtaion, testFn);
        }
    }
}
function pruneKeysAsync(root, currentBranch, pretestTransformtaion, testFn) {
    return __awaiter(this, void 0, void 0, function () {
        var keys, _i, keys_2, key, val, res, transfomedData, er_1, res, val, transfomedData, er_2, surviverKeys, _a, surviverKeys_2, key, surviverValue;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    keys = getKeys(currentBranch);
                    _i = 0, keys_2 = keys;
                    _b.label = 1;
                case 1:
                    if (!(_i < keys_2.length)) return [3 /*break*/, 7];
                    key = keys_2[_i];
                    val = currentBranch[key];
                    res = false;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    delete currentBranch[key];
                    transfomedData = pretestTransformtaion(root);
                    return [4 /*yield*/, testFn(transfomedData)];
                case 3:
                    res = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    er_1 = _b.sent();
                    res = false;
                    return [3 /*break*/, 5];
                case 5:
                    if (res === true) {
                        return [3 /*break*/, 6];
                    }
                    currentBranch[key] = val;
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    if (!lodash_1.default.isArray(currentBranch)) return [3 /*break*/, 13];
                    _b.label = 8;
                case 8:
                    if (!!lodash_1.default(currentBranch).last()) return [3 /*break*/, 13];
                    res = false;
                    val = lodash_1.default(currentBranch).last();
                    if (val !== null && val !== undefined) {
                        return [3 /*break*/, 13];
                    }
                    _b.label = 9;
                case 9:
                    _b.trys.push([9, 11, , 12]);
                    val = currentBranch.pop();
                    transfomedData = pretestTransformtaion(root);
                    return [4 /*yield*/, testFn(transfomedData)];
                case 10:
                    res = _b.sent();
                    return [3 /*break*/, 12];
                case 11:
                    er_2 = _b.sent();
                    res = false;
                    return [3 /*break*/, 12];
                case 12:
                    if (res !== true) {
                        currentBranch.push(val);
                        return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 8];
                case 13:
                    surviverKeys = getKeys(currentBranch);
                    _a = 0, surviverKeys_2 = surviverKeys;
                    _b.label = 14;
                case 14:
                    if (!(_a < surviverKeys_2.length)) return [3 /*break*/, 17];
                    key = surviverKeys_2[_a];
                    surviverValue = currentBranch[key];
                    if (!lodash_1.default.isObjectLike(surviverValue)) return [3 /*break*/, 16];
                    return [4 /*yield*/, pruneKeysAsync(root, surviverValue, pretestTransformtaion, testFn)];
                case 15:
                    _b.sent();
                    _b.label = 16;
                case 16:
                    _a++;
                    return [3 /*break*/, 14];
                case 17: return [2 /*return*/];
            }
        });
    });
}
var degradationsByType = {
    boolean: [false, undefined],
    number: [1, 0, undefined],
    string: ["a", " ", "", undefined],
    null: [],
    undefined: []
};
function degradePrimitiveValues(root, currentBranch, pretestTransformtaion, testFn) {
    var keys = getKeys(currentBranch);
    keysLoop: for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
        var key = keys_3[_i];
        var val = currentBranch[key];
        var typeofVal = typeof val;
        var listOfPossibleDegradations = degradationsByType[typeofVal] || [];
        var lastPassingValue = val;
        for (var _a = 0, listOfPossibleDegradations_1 = listOfPossibleDegradations; _a < listOfPossibleDegradations_1.length; _a++) {
            var degradedValue = listOfPossibleDegradations_1[_a];
            var res = false;
            try {
                currentBranch[key] = degradedValue;
                var transfomedData = pretestTransformtaion(root);
                res = testFn(transfomedData);
            }
            catch (er) {
                res = false;
            }
            if (res) {
                lastPassingValue = degradedValue;
            }
            else {
                currentBranch[key] = lastPassingValue;
                continue keysLoop;
            }
        }
    }
    var surviverKeys = getKeys(currentBranch);
    for (var _b = 0, surviverKeys_3 = surviverKeys; _b < surviverKeys_3.length; _b++) {
        var key = surviverKeys_3[_b];
        var surviverValue = currentBranch[key];
        if (lodash_1.default.isObjectLike(surviverValue)) {
            degradePrimitiveValues(root, surviverValue, pretestTransformtaion, testFn);
        }
    }
}
function degradePrimitiveValuesAsync(root, currentBranch, pretestTransformtaion, testFn) {
    return __awaiter(this, void 0, void 0, function () {
        var keys, _i, keys_4, key, val, typeofVal, listOfPossibleDegradations, lastPassingValue, _a, listOfPossibleDegradations_2, degradedValue, res, transfomedData, er_3, surviverKeys, _b, surviverKeys_4, key, surviverValue;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    keys = getKeys(currentBranch);
                    _i = 0, keys_4 = keys;
                    _c.label = 1;
                case 1:
                    if (!(_i < keys_4.length)) return [3 /*break*/, 9];
                    key = keys_4[_i];
                    val = currentBranch[key];
                    typeofVal = typeof val;
                    listOfPossibleDegradations = degradationsByType[typeofVal] || [];
                    lastPassingValue = val;
                    _a = 0, listOfPossibleDegradations_2 = listOfPossibleDegradations;
                    _c.label = 2;
                case 2:
                    if (!(_a < listOfPossibleDegradations_2.length)) return [3 /*break*/, 8];
                    degradedValue = listOfPossibleDegradations_2[_a];
                    res = false;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    currentBranch[key] = degradedValue;
                    transfomedData = pretestTransformtaion(root);
                    return [4 /*yield*/, testFn(transfomedData)];
                case 4:
                    res = _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    er_3 = _c.sent();
                    res = false;
                    return [3 /*break*/, 6];
                case 6:
                    if (res) {
                        lastPassingValue = degradedValue;
                    }
                    else {
                        currentBranch[key] = lastPassingValue;
                        return [3 /*break*/, 8];
                    }
                    _c.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 2];
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9:
                    surviverKeys = getKeys(currentBranch);
                    _b = 0, surviverKeys_4 = surviverKeys;
                    _c.label = 10;
                case 10:
                    if (!(_b < surviverKeys_4.length)) return [3 /*break*/, 13];
                    key = surviverKeys_4[_b];
                    surviverValue = currentBranch[key];
                    if (!lodash_1.default.isObjectLike(surviverValue)) return [3 /*break*/, 12];
                    return [4 /*yield*/, degradePrimitiveValuesAsync(root, surviverValue, pretestTransformtaion, testFn)];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12:
                    _b++;
                    return [3 /*break*/, 10];
                case 13: return [2 /*return*/];
            }
        });
    });
}
var defaultValuesByType = {
    boolean: false,
    number: 0,
    string: ""
};
function getCloneWithPrimitiveValuesSetToDefaults(root) {
    var clone = lodash_1.default.cloneDeep(root);
    setPrimitiveValuesToDefaults(clone, clone);
    return clone;
}
function setPrimitiveValuesToDefaults(root, currentBranch) {
    var keys = getKeys(currentBranch);
    for (var _i = 0, keys_5 = keys; _i < keys_5.length; _i++) {
        var key = keys_5[_i];
        var val = currentBranch[key];
        var typeofVal = typeof val;
        currentBranch[key] = typeofVal in defaultValuesByType
            ? defaultValuesByType[typeofVal]
            : val;
        if (lodash_1.default.isObjectLike(val)) {
            setPrimitiveValuesToDefaults(root, val);
        }
    }
}
//# sourceMappingURL=index.js.map