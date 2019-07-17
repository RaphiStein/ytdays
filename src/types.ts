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

export enum Day {
    Saturday = "Saturday",
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday"
}