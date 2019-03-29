"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
function goldwash(initial, testFn) {
    if (!initial || typeof initial != 'object') {
        throw new Error('Initial data must be an object (or array)');
    }
    var data = lodash_1.default.cloneDeep(initial);
    var initialTest = testFn(data);
    if (!initialTest) {
        throw new Error('Initial goldwash (before any changes were made ' +
            'to value provide) returned false. Test or data is invalid.');
    }
    pruneKeys(data, data, testFn);
    degradePrimitiveValues(data, data, testFn);
    return data;
}
exports.goldwash = goldwash;
function getKeys(val) {
    return lodash_1.default(val).keys().value();
}
function pruneKeys(root, currentBranch, testFn) {
    var keys = getKeys(currentBranch);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var val = currentBranch[key];
        var res = false;
        try {
            delete currentBranch[key];
            res = testFn(root);
        }
        catch (er) {
            res = false;
        }
        if (res === true) {
            continue;
        }
        currentBranch[key] = val;
    }
    var surviverKeys = getKeys(currentBranch);
    for (var _a = 0, surviverKeys_1 = surviverKeys; _a < surviverKeys_1.length; _a++) {
        var key = surviverKeys_1[_a];
        var surviverValue = currentBranch[key];
        if (lodash_1.default.isObjectLike(surviverValue)) {
            pruneKeys(root, surviverValue, testFn);
        }
    }
}
var degradationsByType = {
    boolean: [false, undefined],
    number: [1, 0, undefined],
    string: ["a", " ", "", undefined],
    null: [],
    undefined: []
};
function degradePrimitiveValues(root, currentBranch, testFn) {
    var keys = getKeys(currentBranch);
    keysLoop: for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        var val = currentBranch[key];
        var typeofVal = typeof val;
        var listOfPossibleDegradations = degradationsByType[typeofVal] || [];
        var lastPassingValue = val;
        for (var _a = 0, listOfPossibleDegradations_1 = listOfPossibleDegradations; _a < listOfPossibleDegradations_1.length; _a++) {
            var degradedValue = listOfPossibleDegradations_1[_a];
            var res = false;
            try {
                currentBranch[key] = degradedValue;
                res = testFn(root);
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
    for (var _b = 0, surviverKeys_2 = surviverKeys; _b < surviverKeys_2.length; _b++) {
        var key = surviverKeys_2[_b];
        var surviverValue = currentBranch[key];
        if (lodash_1.default.isObjectLike(surviverValue)) {
            degradePrimitiveValues(root, surviverValue, testFn);
        }
    }
}
//# sourceMappingURL=index.js.map