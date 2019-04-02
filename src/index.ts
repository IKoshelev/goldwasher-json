import _ from 'lodash';

type testFn<T> = (current: T) => boolean;

type testFnAsync<T> = (current: T) => Promise<boolean>;

export function goldwash<T extends object>(initial: T, testFn: testFn<T>): Partial<T> {

    throwIfNotObject<T>(initial);

    const data = _.cloneDeep(initial);

    const initialTest = testFn(data);

    if (!initialTest) {
        throwInitialTestNotPassing();
    }

    pruneKeys(data, data, (currentData) => currentData, testFn);

    degradePrimitiveValues(data, data, (currentData) => currentData, testFn);

    return data;
}

export async function goldwashAsync<T extends object>(initial: T, testFn: testFnAsync<T>): Promise<Partial<T>> {

    throwIfNotObject<T>(initial);

    const data = _.cloneDeep(initial);

    const initialTest = await testFn(data);

    if (!initialTest) {
        throwInitialTestNotPassing();
    }

    await pruneKeysAsync(data, data, (currentData) => currentData, testFn);

    await degradePrimitiveValuesAsync(data, data, (currentData) => currentData, testFn);

    return data;
}

export function centrifuge<T extends object>(initial: T, testFn: testFn<T>): [T, Partial<T>] {

    throwIfNotObject<T>(initial);

    const data = _.cloneDeep(initial);

    const initialTest = testFn(data);

    if (!initialTest) {
        throwInitialTestNotPassing();
    }

    let base = getCloneWithPrimitiveValuesSetToDefaults(data);

    let mergeCurrentDataIntoBase = (currentData: T) => {
        return _.merge({}, base, currentData);
    }

    pruneKeys(data, data, mergeCurrentDataIntoBase, testFn);
    degradePrimitiveValues(data, data, mergeCurrentDataIntoBase, testFn);

    return [base, data];
}

export async function centrifugeAsync<T extends object>(initial: T, testFn: testFnAsync<T>): Promise<[T, Partial<T>]> {

    throwIfNotObject<T>(initial);

    const data = _.cloneDeep(initial);

    const initialTest = await testFn(data);

    if (!initialTest) {
        throwInitialTestNotPassing();
    }

    let base = getCloneWithPrimitiveValuesSetToDefaults(data);

    let mergeCurrentDataIntoBase = (currentData: T) => {
        return _.merge({}, base, currentData);
    }

    await pruneKeysAsync(data, data, mergeCurrentDataIntoBase, testFn);

    await degradePrimitiveValuesAsync(data, data, mergeCurrentDataIntoBase, testFn);

    return [base, data];
}

function throwInitialTestNotPassing() {
    throw new Error('Initial goldwash (before any changes were made ' +
        'to value provide) returned false. Test or data is invalid.');
}

function throwIfNotObject<T extends object>(initial: T) {
    if (!initial
        || typeof initial != 'object'
        || _.isDate(initial)
        || _.isRegExp(initial)) {
        throw new Error('Initial data must be an object (or array)');
    }
}

function getKeys(val: any): string[] {
    return _(val).keys().value();
}

function pruneKeys<TRoot extends object>(
    root: TRoot,
    currentBranch: any,
    pretestTransformtaion: (currentData: TRoot) => TRoot,
    testFn: testFn<TRoot>) {

    let keys = getKeys(currentBranch);

    for (let key of keys) {
        let val = currentBranch[key];

        let res = false;

        try {
            delete currentBranch[key];
            let transfomedData = pretestTransformtaion(root);
            res = testFn(transfomedData);
        } catch (er) {
            res = false;
        }

        if (res === true) {
            continue;
        }

        currentBranch[key] = val;
    }

    if(_.isArray(currentBranch)) {

        while (!_(currentBranch).last()) {
            let res = false;
            let val =_(currentBranch).last();
            if (val !== null && val !== undefined) {
                break;
            }

            try {
                val = currentBranch.pop();
                let transfomedData = pretestTransformtaion(root);
                res = testFn(transfomedData);
            } catch (er) {
                res = false;
            }

            if (res !== true) {
                currentBranch.push(val);
                break;
            }
        }
    }

    let surviverKeys = getKeys(currentBranch);

    for (let key of surviverKeys) {
        let surviverValue = currentBranch[key];
        if (_.isObjectLike(surviverValue)) {
            pruneKeys(root, surviverValue, pretestTransformtaion, testFn);
        }
    }
}


async function pruneKeysAsync<TRoot extends object>(
    root: TRoot,
    currentBranch: any,
    pretestTransformtaion: (currentData: TRoot) => TRoot,
    testFn: testFnAsync<TRoot>) {

    let keys = getKeys(currentBranch);

    for (let key of keys) {
        let val = currentBranch[key];

        let res = false;

        try {
            delete currentBranch[key];
            let transfomedData = pretestTransformtaion(root);
            res = await testFn(transfomedData);
        } catch (er) {
            res = false;
        }

        if (res === true) {
            continue;
        }

        currentBranch[key] = val;
    }

    if(_.isArray(currentBranch)) {

        while (!_(currentBranch).last()) {
            let res = false;
            let val =_(currentBranch).last();
            if (val !== null && val !== undefined) {
                break;
            }

            try {
                val = currentBranch.pop();
                let transfomedData = pretestTransformtaion(root);
                res = await testFn(transfomedData);
            } catch (er) {
                res = false;
            }

            if (res !== true) {
                currentBranch.push(val);
                break;
            }
        }
    }

    let surviverKeys = getKeys(currentBranch);

    for (let key of surviverKeys) {
        let surviverValue = currentBranch[key];
        if (_.isObjectLike(surviverValue)) {
            await pruneKeysAsync(root, surviverValue, pretestTransformtaion, testFn);
        }
    }
}

let degradationsByType: { [key: string]: any[] } = {
    boolean: [false, undefined],
    number: [1, 0, undefined],
    string: ["a", " ", "", undefined],
    null: [],
    undefined: []
}

function degradePrimitiveValues<TRoot extends object>(
    root: TRoot,
    currentBranch: any,
    pretestTransformtaion: (currentData: TRoot) => TRoot,
    testFn: testFn<TRoot>) {

    let keys = getKeys(currentBranch);

    keysLoop: for (let key of keys) {
        let val = currentBranch[key];

        let typeofVal = typeof val;
        let listOfPossibleDegradations = degradationsByType[typeofVal] || [];

        let lastPassingValue = val;

        for (let degradedValue of listOfPossibleDegradations) {
            let res = false;
            try {
                currentBranch[key] = degradedValue;
                let transfomedData = pretestTransformtaion(root);
                res = testFn(transfomedData);
            } catch (er) {
                res = false;
            }

            if (res) {
                lastPassingValue = degradedValue;
            } else {
                currentBranch[key] = lastPassingValue;
                continue keysLoop;
            }
        }
    }

    let surviverKeys = getKeys(currentBranch);

    for (let key of surviverKeys) {
        let surviverValue = currentBranch[key];
        if (_.isObjectLike(surviverValue)) {
            degradePrimitiveValues(root, surviverValue, pretestTransformtaion, testFn);
        }
    }
}

async function degradePrimitiveValuesAsync<TRoot extends object>(
    root: TRoot,
    currentBranch: any,
    pretestTransformtaion: (currentData: TRoot) => TRoot,
    testFn: testFnAsync<TRoot>) {

    let keys = getKeys(currentBranch);

    keysLoop: for (let key of keys) {
        let val = currentBranch[key];

        let typeofVal = typeof val;
        let listOfPossibleDegradations = degradationsByType[typeofVal] || [];

        let lastPassingValue = val;

        for (let degradedValue of listOfPossibleDegradations) {
            let res = false;
            try {
                currentBranch[key] = degradedValue;
                let transfomedData = pretestTransformtaion(root);
                res = await testFn(transfomedData);
            } catch (er) {
                res = false;
            }

            if (res) {
                lastPassingValue = degradedValue;
            } else {
                currentBranch[key] = lastPassingValue;
                continue keysLoop;
            }
        }
    }

    let surviverKeys = getKeys(currentBranch);

    for (let key of surviverKeys) {
        let surviverValue = currentBranch[key];
        if (_.isObjectLike(surviverValue)) {
            await degradePrimitiveValuesAsync(root, surviverValue, pretestTransformtaion, testFn);
        }
    }
}


let defaultValuesByType: { [key: string]: any } = {
    boolean: false,
    number: 0,
    string: ""
}

function getCloneWithPrimitiveValuesSetToDefaults<TRoot extends object>(root: TRoot) {
    let clone = _.cloneDeep(root);
    setPrimitiveValuesToDefaults(clone, clone);
    return clone;
}

function setPrimitiveValuesToDefaults<TRoot extends object>(
    root: TRoot,
    currentBranch: any) {

    let keys = getKeys(currentBranch);

    for (let key of keys) {

        let val = currentBranch[key];
        let typeofVal = typeof val;
        currentBranch[key] = typeofVal in defaultValuesByType
            ? defaultValuesByType[typeofVal]
            : val;

        if (_.isObjectLike(val)) {
            setPrimitiveValuesToDefaults(root, val);
        }
    }
}