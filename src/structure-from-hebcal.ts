import { IHebcalYearRaw, IInputYear, IInputSetItem, IInputSet, IHebcalYearItem, YomTov } from './types';
import { dateToDayOfWeek } from './utils';

/** Converts HebCal structure to IInputYear[] */

export function structureFromHebcal(hebcalRaw: IHebcalYearRaw): IInputYear {

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

            if (hebCalYearItem.title.match(/^Erev.*/)) continue;

            setItems.push( {
                name: convertHebcalMemoToYomTovName(hebCalYearItem.memo),
                days: [dateToDayOfWeek(hebCalYearItem.date)]
            })
        }

        sets.push({
            setName: convertHebcalMemoToYomTovName(s[0].memo),
            setItems
        })
    }

    console.log('sets', hebcalRaw.year, sets);


    return {
        year: hebcalRaw.year,
        sets
    }


}

/** Hebcal names are different for different days of a Yom Tov, i.e. "Pesach I" and "Pesach II"
 * this function uses the memo field (which is the same for all days) to unify the Yom Tov name
*/
function convertHebcalMemoToYomTovName(memo: string): YomTov {
    switch(memo){
        case "Purim is one of the most joyous and fun holidays on the Jewish calendar":
            return YomTov.Purim;
        case "Passover, the Feast of Unleavened Bread":
            return YomTov.Pesach;
        case "Festival of Weeks, commemorates the giving of the Torah at Mount Sinai":
            return YomTov.Shavuot;
        case "The Ninth of Av, fast commemorating the destruction of the two Temples":
            return YomTov.TishaBav;
        case "The Jewish New Year":
            return YomTov.RoshHashana;
        case "Day of Atonement":
            return YomTov.YomKippur;
        case "Feast of Tabernacles":
            return YomTov.Sukkot;
        case "Eighth Day of Assembly":
        case "Day of Celebrating the Torah":
            return YomTov.SheminiAtzeret;
        case "The Jewish festival of rededication, also known as the Festival of Lights":
            return YomTov.Chanukah;
        default:
            throw "Memo does not match any holiday! \"" + memo + "\"";
    }
}