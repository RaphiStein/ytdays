import { IInputYear, Day } from './types';

/** Hebcal API: https://www.hebcal.com/home/195/jewish-calendar-rest-api */

export const dates: IInputYear[] = [
    {
      year: "2018",
      sets: [
        {
          setName: "Pesach",
          setItems: [
            {
              name: "Pesach - Part I",
              days: [Day.Saturday, Day.Sunday]
            },
            {
              name: "Chol Hamoed Pesach",
              days: [Day.Monday, Day.Tuesday, Day.Wednesday, Day.Thursday]
            },
            {
              name: "Pesach - Part II",
              days: [Day.Friday, Day.Saturday]
            }
          ]
        },
        {
          setName: "Shavuot",
          setItems: [
            {
              name: "Shavuot",
              days: [Day.Sunday, Day.Monday]
            }
          ]
        },
        {
          setName: "Rosh Hashana",
          setItems: [
            {
              name: "Rosh Hashana",
              days: [Day.Monday, Day.Tuesday]
            }
          ]
        },
        {
          setName: "Yom Kippur",
          setItems: [
            {
              name: "Yom Kippur",
              days: [Day.Wednesday]
            }
          ]
        },
        {
          setName: "Sukkot",
          setItems: [
            {
              name: "Sukkot",
              days: [Day.Monday, Day.Tuesday]
            },
            {
              name: "Chol Hamoed Sukkot",
              days: [Day.Wednesday, Day.Thursday, Day.Friday, Day.Saturday]
            },
            {
              name: "Hoshana Rabba",
              days: [Day.Sunday]
            },
            {
              name: "Shemi Atzeret",
              days: [Day.Monday, Day.Tuesday]
            }
          ]
        }
      ]
    },
    {
      year: "2019",
      sets: [
        {
          setName: "Pesach",
          setItems: [
            {
              name: "Pesach - Part I",
              days: [Day.Saturday, Day.Sunday]
            },
            {
              name: "Chol Hamoed Pesach",
              days: [Day.Monday, Day.Tuesday, Day.Wednesday, Day.Thursday]
            },
            {
              name: "Pesach - Part II",
              days: [Day.Friday, Day.Saturday]
            }
          ]
        },
        {
          setName: "Rosh Hashana",
          setItems: [
            {
              name: "Rosh Hashana",
              days: [Day.Monday, Day.Tuesday]
            }
          ]
        },
        {
          setName: "Yom Kippur",
          setItems: [
            {
              name: "Yom Kippur",
              days: [ Day.Wednesday ]
            }
          ]
        }
      ]
    },
    {
      year: "2020",
      sets: [
        {
          setName: "Rosh Hashana",
          setItems: [
            {
              name: "Rosh Hashana",
              days: [Day.Saturday, Day.Sunday]
            }
          ]
        },
        {
          setName: "Yom Kippur",
          setItems: [
            {
              name: "Yom Kippur",
              days: [Day.Monday]
            }
          ]
        }
      ]
    },
    {
      year: "2021",
      sets: [
        {
          setName: "Rosh Hashana",
          setItems: [
            {
              name: "Rosh Hashana",
              days: [Day.Tuesday, Day.Wednesday]
            }
          ]
        },
        {
          setName: "Yom Kippur",
          setItems: [
            {
              name: "Yom Kippur",
              days: [Day.Thursday]
            }
          ]
        }
      ]
    }
  ];
