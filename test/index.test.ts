import * as mocha from 'mocha';
import { expect } from 'chai';

import { goldwash } from './../src/index';

const delay = (ms: number = 0) => new Promise((resolve) => setTimeout(resolve, ms));

function throwIf(cond: boolean) {
    if(cond) {
        throw new Error("something wrong");
    }
}

describe('goldwasher-json ', () => {

    it('exists', () => {
        expect(typeof goldwash).to.equal('function');
    });

    it('throws if data is not an object or array', () => {
        [undefined, null, true, "", 1, new Date(), ()=>{}]
            .forEach((i:any) => {
                try {
                    goldwash(i, () => false);
                } catch ( er ) {
                    expect(er === undefined).to.equal(false);
                    return;
                }
                expect(true).to.equal(false);
            });       
    });

    it('throws if provided data does not pass test prior to any changes', () => {
        try {
            goldwash({}, () => false);
        } catch ( er ) {
            expect(er === undefined).to.equal(false);
            return;
        }
        expect(true).to.equal(false);
    });

    it('does not modify initial data', () => {
        let data = {
            a: 1,
            b: '',
            c: true,
            d: undefined,
            e: [1,2,3],
            f: {}
        }

        let initialJson = JSON.stringify(data);

        goldwash(data, () => true);

        expect(JSON.stringify(data)).to.equal(initialJson);
    });

    it('will goldwash an object by trying to delete keys recursively', () => {
        let data = {
            a: 1,
            b: '',
            c: true,
            d: undefined,
            e: [1,2,3],
            f: {}
        }

        let washedData = {
            a:1,
            e:[null,2,null]
        }

        let fnOfInterest = (d: typeof data) => {
            return d.a + d.e[1];
        }

        let result = goldwash(data, (d) => {
                        return fnOfInterest(d) === 3;
                    });

        expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
    });

    it('for keys that cant be outright deleted, will goldwashing by trying to degrade to simpler values', () => {
        
        let data = {
            a1: 200,
            a2: 300,
            b1: 'some string',
            b2: 'some string',
            c: true,
            d: undefined,
            e: [1,2,3],
            f: {}
        }

        let washedData = {
            a1:200,
            a2:0,
            b2:" ",
            e:[null,2,null]
        }

        let fnOfInterest = (d: typeof data) => {
            // conditions don't influence calculation, but keys need to be present
            throwIf('a1' in d === false );
            throwIf(typeof d.a2 !== 'number');
            throwIf('b1' in d === false );
            throwIf(d.b2.length === 0);
            return d.a1 + d.e[1];
        }

        let result = goldwash(data, (d) => {
                        return fnOfInterest(d) === 202;
                    });

        expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
    });

});