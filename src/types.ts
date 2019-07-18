export interface IInputYear {
    year: string;
    sets: IInputSet[];
}

export interface IInputSet {
    setName: string;
    setItems: IInputSetItem[]
}

export interface IInputSetItem {
    name: string;
    days: Day[]
}

export interface IHebcalYearRaw {
    link: string; // link to API url that was fetched to get this result
    location: { geo: string};
    items: IHebcalYearItem[],
    title: string; // i.e. Hebcal 2023
    year?: string; // appended later by this app. Parsed from title

}

export interface IHebcalYearItem {
    title: string;
    link: string; // i.e https://www.hebcal.com/holidays/purim,
    hebrew: string; // hebrew characters
    date: string; // i.e. "2023-03-06",
    category: string; // i.e. "holiday",
    subcat: string; // "major",
    memo: string; // "Purim is one of the most joyous and fun holidays on the Jewish calendar"
    yomtov?: boolean;
}

/** Block = a single day and and all the data that goes with it */
export interface IStructuredD3Block {
    year: string;
    yomTov: string;
    yomTovIndex: number;
    yomTovColor: string;
    subYomTov: string;
    subYomTovIndex: number,
    day: Day
}

//////////////////////////////////////
//    ENUMS
//////////////////////////////////////

export enum Day {
    Saturday = "Saturday",
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday"
}

export enum YomTov {
    Purim = 'Purim',
    Pesach = 'Pesach',
    Shavuot = 'Shavuot',
    TishaBav = 'Tisha B\'av',
    RoshHashana = 'Rosh Hashana',
    YomKippur = 'Yom Kippur',
    Sukkot = 'Sukkot',
    SheminiAtzeret = 'SheminiAtzeret',
    Chanukah = 'Chanukah'
}