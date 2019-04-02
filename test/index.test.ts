import * as mocha from 'mocha';
import { expect } from 'chai';

import { goldwash, goldwashAsync, centrifuge, centrifugeAsync } from './../src/index';

const delay = (ms: number = 0) => new Promise((resolve) => setTimeout(resolve, ms));

function throwIf(cond: boolean) {
    if (cond) {
        throw new Error("something wrong");
    }
}

describe('goldwasher-json ', () => {

    describe('goldwash', () => {
        it('exists', () => {
            expect(typeof goldwash).to.equal('function');
        });

        it('throws if data is not an object or array', () => {

            const data: any[] = [undefined, null, true, "", 1, new Date(), /abc/, () => { return 1; }];

            for (let i of data) {
                try {
                    goldwash(i, () => true);
                } catch (er) {
                    expect(er === undefined).to.equal(false);
                    continue;
                }

                expect(true).to.equal(false);
            }
        });

        it('throws if provided data does not pass test prior to any changes', () => {
            try {
                goldwash({}, () => false);
            } catch (er) {
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
                e: [1, 2, 3],
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
                e: [1, 2, 3],
                f: {}
            }

            let washedData = {
                a: 1,
                e: [null, 2]
            }

            let fnOfInterest = (d: typeof data) => {
                return d.a + d.e[1];
            }

            let result = goldwash(data, (d) => {
                return fnOfInterest(d) === 3;
            });

            expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
        });

        it('during goldwash will go deep', () => {
            let data = {
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
                        }] as { a: { a: number } }[],
                        c: 'a'
                    },
                    c: 5
                },
                f: {}
            }

            let washedData = {
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
            }

            let fnOfInterest = (d: typeof data) => {
                return d.a + d.c.b.b[1].a.a;
            }

            let result = goldwash(data, (d) => {
                return fnOfInterest(d) === 10;
            });

            expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
        });

        it('for keys that cant be outright deleted, will goldwash by trying to degrade to simpler values', () => {

            let data = {
                a1: 200,
                a2: 300,
                b1: 'some string',
                b2: 'some string',
                c: true,
                d: undefined,
                e: [1, 2, 3],
                f: {}
            }

            let washedData = {
                a1: 200,
                a2: 0,
                b2: " ",
                e: [null, 2]
            }

            let fnOfInterest = (d: typeof data) => {
                // conditions don't influence calculation, but keys need to be present
                throwIf('a1' in d === false);
                throwIf(typeof d.a2 !== 'number');
                throwIf('b1' in d === false);
                throwIf(d.b2.length === 0);
                return d.a1 + d.e[1];
            }

            let result = goldwash(data, (d) => {
                return fnOfInterest(d) === 202;
            });

            expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
        });
    });

    describe('goldwashAsync', () => {
        it('exists', () => {
            expect(typeof goldwashAsync).to.equal('function');
        });

        it('rejects if data is not an object or array', async () => {

            const data: any[] = [undefined, null, true, "", 1, /abc/, new Date(), () => { return 1; }];

            for (let i of data) {
                try {
                    await goldwashAsync(i, () => Promise.resolve(true));
                } catch (er) {
                    expect(er === undefined).to.equal(false);
                    continue;
                }

                expect(true).to.equal(false);
            }
        });

        it('rejects if provided data does not pass test prior to any changes', async () => {
            try {
                await goldwashAsync({}, () => Promise.resolve(false));
            } catch (er) {
                expect(er === undefined).to.equal(false);
                return;
            }
            expect(true).to.equal(false);
        });

        it('does not modify initial data', async () => {
            let data = {
                a: 1,
                b: '',
                c: true,
                d: undefined,
                e: [1, 2, 3],
                f: {}
            }

            let initialJson = JSON.stringify(data);

            await goldwashAsync(data, () => Promise.resolve(true));

            expect(JSON.stringify(data)).to.equal(initialJson);
        });

        it('will goldwash an object by trying to delete keys recursively', async () => {
            let data = {
                a: 1,
                b: '',
                c: true,
                d: undefined,
                e: [1, 2, 3],
                f: {}
            }

            let washedData = {
                a: 1,
                e: [null, 2]
            }

            let fnOfInterest = (d: typeof data) => {
                return d.a + d.e[1];
            }

            let result = await goldwashAsync(data, (d) => {
                return Promise.resolve(fnOfInterest(d) === 3);
            });

            expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
        });

        it('during goldwash will go deep', async () => {
            let data = {
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
                        }] as { a: { a: number } }[],
                        c: 'a'
                    },
                    c: 5
                },
                f: {}
            }

            let washedData = {
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
            }

            let fnOfInterest = (d: typeof data) => {
                return d.a + d.c.b.b[1].a.a;
            }

            let result = await goldwashAsync(data, (d) => {
                return Promise.resolve(fnOfInterest(d) === 10);
            });

            expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
        });

        it('for keys that cant be outright deleted, will goldwash by trying to degrade to simpler values', async () => {

            let data = {
                a1: 200,
                a2: 300,
                b1: 'some string',
                b2: 'some string',
                c: true,
                d: undefined,
                e: [1, 2, 3],
                f: {}
            }

            let washedData = {
                a1: 200,
                a2: 0,
                b2: " ",
                e: [null, 2]
            }

            let fnOfInterest = (d: typeof data) => {
                // conditions don't influence calculation, but keys need to be present
                throwIf('a1' in d === false);
                throwIf(typeof d.a2 !== 'number');
                throwIf('b1' in d === false);
                throwIf(d.b2.length === 0);
                return d.a1 + d.e[1];
            }

            let result = await goldwashAsync(data, (d) => {
                return Promise.resolve(fnOfInterest(d) === 202);
            });

            expect(JSON.stringify(result)).to.equal(JSON.stringify(washedData));
        });
    });

    describe('centrifuge', () => {

        it('can separate data into base with primitive values set to default and actual test data', () => {

            let data = {
                a1: 200,
                a2: 300,
                b1: 'some string',
                b2: 'some string',
                c: true,
                d: undefined,
                e: [1, 2, 3],
                f: {}
            }

            let centrifugedData = {
                a1: 200,
                e: [null, 2]
            }

            let centrifugedBase = {
                a1: 0,
                a2: 0,
                b1: "",
                b2: "",
                c: false,
                d: undefined,
                e: [0, 0, 0],
                f: {}
            }

            let fnOfInterest = (d: typeof data) => {
                // conditions don't influence calculation, but keys need to be present
                throwIf('a1' in d === false);
                throwIf(typeof d.a2 !== 'number');
                throwIf('b1' in d === false);
                throwIf(typeof d.b2 !== 'string');
                return d.a1 + d.e[1];
            }

            let [base, result] = centrifuge(data, (d) => {
                return fnOfInterest(d) === 202;
            });

            expect(JSON.stringify(result)).to.equal(JSON.stringify(centrifugedData));
            expect(JSON.stringify(base)).to.equal(JSON.stringify(centrifugedBase));
        });
    });

    describe('centrifugeAsync', () => {

        it('can separate data into base with primitive values set to default and actual test data', async () => {

            let data = {
                a1: 200,
                a2: 300,
                b1: 'some string',
                b2: 'some string',
                c: true,
                d: undefined,
                e: [1, 2, 3],
                f: {}
            }

            let centrifugedData = {
                a1: 200,
                e: [null, 2]
            }

            let centrifugedBase = {
                a1: 0,
                a2: 0,
                b1: "",
                b2: "",
                c: false,
                d: undefined,
                e: [0, 0, 0],
                f: {}
            }

            let fnOfInterest = (d: typeof data) => {
                // conditions don't influence calculation, but keys need to be present
                throwIf('a1' in d === false);
                throwIf(typeof d.a2 !== 'number');
                throwIf('b1' in d === false);
                throwIf(typeof d.b2 !== 'string');
                return d.a1 + d.e[1];
            }

            let [base, result] = await centrifugeAsync(data, (d) => {
                return Promise.resolve(fnOfInterest(d) === 202);
            });

            expect(JSON.stringify(result)).to.equal(JSON.stringify(centrifugedData));
            expect(JSON.stringify(base)).to.equal(JSON.stringify(centrifugedBase));
        });
    });

    describe('tests from readme', () => {

        type RentalRequest = typeof carRentalRequest;
        type RentalHistory = RentalRequest['renter']['rentalHistory'];

        function blackboxRateCalulationFunction(data: RentalRequest) {
            //50 line of calculations
            let preDiscountPrice = data.carProfile.inflationAdjustedPrice * data.carProfile.amotrization;

            //50 line of calculations

            let corporateDiscount = getCorporatePartnerBonus(
                data.renter.name,
                data.rentOptions.corporatePartner,
                data.rentOptions.duration);

            //50 line of calculations

            let longRenterDiscount = getBonusForLongRenters(data.renter.rentalHistory);

            //50 line of calculations

            let discount = data.renter.loyaltyBonus + corporateDiscount + longRenterDiscount;

            let simplePrice = preDiscountPrice / 360 * data.rentOptions.duration * (1 - discount);

            return {
                quiteSeasonPrice: 0,
                governmentPrice: 0,
                simplePrice,
                // 10 more different price rates
            };

            function getCorporatePartnerBonus(name: string, partnerId: number, duration: number, ) {
                if (name.length > 3 && partnerId === 5 && duration === 3) {
                    return 0.05;
                }
                return 0;
            }

            function getBonusForLongRenters(history: RentalHistory) {
                return history.some(h => h.duration >= 100)
                    ? 0.02
                    : 0;
            }
        }

        let carRentalRequest = {
            renter: {
                name: "John Smith",
                loyaltyBonus: 0.07,
                rentalHistory: [
                    { duration: 10, price: 1500, dates: [/**/] },
                    { duration: 20, price: 3000, dates: [/**/] },
                    { duration: 105, price: 12000, dates: [/**/] },
                    // 2 years of rental history
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
                    //... 10 years of promo options
                }
            }
        }

        it('simplePrice calclculation calculates correctly', () => {

            let result = blackboxRateCalulationFunction(carRentalRequest);

            expect(result.simplePrice).to.equal(88.752);
        });

        it('simplePrice calclculation calculates correctly', () => {

            let goldwashedData = goldwash(carRentalRequest, (data) => {

                let result = blackboxRateCalulationFunction(data);

                return result.simplePrice === 88.752;
            });
            //console.log(JSON.stringify(goldwashedData));
        });
    });
});
