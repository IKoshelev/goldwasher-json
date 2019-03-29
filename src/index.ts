import _ from 'lodash';

type testFn<T> = (current:T) => boolean;

export function goldwash<T extends object>(initial:T, testFn: testFn<T>): T {

    if(!initial || typeof initial != 'object') {
        throw new Error('Initial data must be an object (or array)');
    }

    const data = _.cloneDeep(initial);

    const initialTest = testFn(data);

    if (!initialTest) {
        throw new Error('Initial goldwash (before any changes were made '+ 
        'to value provide) returned false. Test or data is invalid.');
    }
  
    pruneKeys(data, data, testFn);

    degradePrimitiveValues(data, data, testFn);

    return data;
}

function getKeys(val: any): string[]{
    return _(val).keys().value();
}

function pruneKeys<TRoot extends object>(
                                    root:TRoot, 
                                    currentBranch: any, 
                                    testFn: testFn<TRoot>) {

    let keys = getKeys(currentBranch);

    for (let key of keys) {
        let val = currentBranch[key];

        let res = false;

        try {        
            delete currentBranch[key];        
            res = testFn(root);
        } catch (er) {
            res = false;
        }

        if(res === true) {
            continue;
        }

        currentBranch[key] = val;
    }

    let surviverKeys =  getKeys(currentBranch);

    for (let key of surviverKeys) {
        let surviverValue =  currentBranch[key];
        if(_.isObjectLike(surviverValue)) {
            pruneKeys(root, surviverValue, testFn);
        }
    }
}

let degradationsByType: {[key: string]:any[] } = {
    boolean: [false, undefined],
    number: [1, 0, undefined],
    string: ["a", " ", "", undefined],
    null: [],
    undefined: []
}

function degradePrimitiveValues<TRoot extends object>(
                                    root:TRoot, 
                                    currentBranch: any, 
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
                res = testFn(root);
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
        let surviverValue =  currentBranch[key];
        if(_.isObjectLike(surviverValue)) {
            degradePrimitiveValues(root, surviverValue, testFn);
        }
    }
}