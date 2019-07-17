import { IHebcalYearRaw, IInputYear, IInputSetItem, IInputSet, IHebcalYearItem } from './types';

/** Converts HebCal structure to IInputYear[] */

export function structureByYear(hebcalRaw: IHebcalYearRaw): IInputYear {

    // Parse year from title
    hebcalRaw.year = hebcalRaw.title.split(' ')[1];


    const yomTovSets: {[key: string]: IHebcalYearItem[] } = hebcalRaw.items.reduce(function(accumulator, i) {
        (accumulator[i.memo] = accumulator[i.memo] || []).push(i);
        return accumulator;
    }, {});

    const mappedToArray = Object.keys(yomTovSets).map( (k) => yomTovSets[k]);


    const sets: IInputSet[] = [];
    for (let s of mappedToArray) {
        const setItems: IInputSetItem[] = [];
        for (const hebCalYearItem of s){
           setItems.push( {
                name: hebCalYearItem.memo,
                days: []
           })
        }

        sets.push({
            setName: s[0].memo,
            setItems
        })
    }

    console.log('sets', sets);


    return {
        year: hebcalRaw.year,
        sets
    }


}