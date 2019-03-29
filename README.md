# goldwasher

lets you refine chunks of JSON data used in your tests by removing all values which don't inflience the result.

## TL;DR;

```typescript
 it('simplePrice calclculation calculates correctly', () => {

    let goldwashedData = goldwash(bigChunkOfJsonData, (data) => {
        
        let result = blackboxRateCalulationFunction(data);

        return result.simplePrice === 88.752;
    });

    //goldwashedData data has minimal set of properties that still produce desired result
    console.log(JSON.stringify(goldwashedData));
});
```

## usage

Imagine a situation. In a car rental company, you start working on a 10 year old module 
for calculating different price rates. Your goal is to remove outdated irrelevant calculations
and start adding new features to the module without braking still used ones. 
A typical calculation function that you have to clean is 500+ lines of code :-(.

Ofcourse, you start by trying to cover your module with unit tests for most frequent paths. 
You check logs, retrieve JSON data for a typical used request and its resulting rate.

You end up with a test like this:

```typescript
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
        //... more of the same
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
```

Doesn't help much to understand, what is actually happening.
So, modify the test to temorarily include golwashing: 

```typescript
 it('simplePrice calclculation calculates correctly', () => {

    let goldwashedData = goldwash(carRentalRequest, (data) => {
        
        let result = blackboxRateCalulationFunction(data);

        return result.simplePrice === 88.752;
    });

    console.log(JSON.stringify(goldwashedData));
});
```

And in console you will get the subset of your JSON that still produces result expected by test.

```typescript 
{ 
    "renter": { 
        "name": "John Smith", 
        "loyaltyBonus": 0.07, 
        "rentalHistory": [
            null, 
            null, 
            { "duration": 105 }
        ] }, 
    "rentOptions": { 
        "duration": 3, 
        "corporatePartner": 5 
    }, 
    "carProfile": { 
        "inflationAdjustedPrice": 17200, 
        "amotrization": 0.72 
    } 
}
```

You can now use this data in your test instead of the previous intimidatingly big chunk.
You can also use it to better understand, which values play actual role in each calculation,
and remove unused values.

# async?

Yes, via `goldwashAsync`, which expect testing function to return Promise&lt;boolean&gt;