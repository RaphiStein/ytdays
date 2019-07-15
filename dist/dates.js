"use strict";
/** Hebcal API: https://www.hebcal.com/home/195/jewish-calendar-rest-api */
var dates = [
    {
        year: "2018",
        sets: [
            {
                setName: "Pesach",
                setItems: [
                    {
                        name: "Pesach - Part I",
                        days: ["Saturday", "Sunday"]
                    },
                    {
                        name: "Chol Hamoed Pesach",
                        days: ["Monday", "Tuesday", "Wednesday", "Thursday"]
                    },
                    {
                        name: "Pesach - Part II",
                        days: ["Friday", "Saturday"]
                    }
                ]
            },
            {
                setName: "Shavuot",
                setItems: [
                    {
                        name: "Shavuot",
                        days: ["Sunday", "Monday"]
                    }
                ]
            },
            {
                setName: "Rosh Hashana",
                setItems: [
                    {
                        name: "Rosh Hashana",
                        days: ["Monday", "Tuesday"]
                    }
                ]
            },
            {
                setName: "Yom Kippur",
                setItems: [
                    {
                        name: "Yom Kippur",
                        days: ["Wednesday"]
                    }
                ]
            },
            {
                setName: "Sukkot",
                setItems: [
                    {
                        name: "Sukkot",
                        days: ["Monday", "Tuesday"]
                    },
                    {
                        name: "Chol Hamoed Sukkot",
                        days: ["Wednesday", "Thursday", "Friday", "Saturday"]
                    },
                    {
                        name: "Hoshana Rabba",
                        days: ["Sunday"]
                    },
                    {
                        name: "Shemi Atzeret",
                        days: ["Monday", "Tuesday"]
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
                        days: ["Saturday", "Sunday"]
                    },
                    {
                        name: "Chol Hamoed Pesach",
                        days: ["Monday", "Tuesday", "Wednesday", "Thursday"]
                    },
                    {
                        name: "Pesach - Part II",
                        days: ["Friday", "Saturday"]
                    }
                ]
            },
            {
                setName: "Rosh Hashana",
                setItems: [
                    {
                        name: "Rosh Hashana",
                        days: ["Monday", "Tuesday"]
                    }
                ]
            },
            {
                setName: "Yom Kippur",
                setItems: [
                    {
                        name: "Yom Kippur",
                        days: ["Wednesday"]
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
                        days: ["Saturday", "Sunday"]
                    }
                ]
            },
            {
                setName: "Yom Kippur",
                setItems: [
                    {
                        name: "Yom Kippur",
                        days: ["Monday"]
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
                        days: ["Tuesday", "Wednesday"]
                    }
                ]
            },
            {
                setName: "Yom Kippur",
                setItems: [
                    {
                        name: "Yom Kippur",
                        days: ["Thursday"]
                    }
                ]
            }
        ]
    }
];
