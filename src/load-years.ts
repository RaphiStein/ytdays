import { restructure } from "./structure-for-d3";
import { structureFromHebcal } from "./structure-from-hebcal";
import { IHebcalYearRaw, IInputYear, IStructuredD3Block } from "./types";

export type PreviousOrFollowing = "previous" | "following";

export function buildYearRange(
  previousOrFollowing: PreviousOrFollowing,
  year: number
): [number, number] {
  if (previousOrFollowing === "previous") {
    return [year - 3, year - 1];
  } else {
    return [year + 1, year + 3];
  }
}
export async function loadYears(
  startYear: number,
  endYear: number
): Promise<IStructuredD3Block[][]> {
  const structuredYears: IInputYear[] = [];

  let promises: Promise<any>[] = [];
  for (let i = startYear; i <= endYear; i++) {
    const url = `https://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on;min=off;mod=off;nx=off;year=${i};month=x;mf=off;c=off`;
    promises.push(
      fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (hebCalYearRaw: IHebcalYearRaw) {
          const structuredYears: IInputYear[] = [];
          structuredYears.push(structureFromHebcal(hebCalYearRaw));
          return restructure(structuredYears);
        })
    );
  }

  let result = await Promise.all(promises);
  return (result = result.map((r) => r[0]));
}
