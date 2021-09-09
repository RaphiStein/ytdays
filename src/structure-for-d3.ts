import { IInputYear, IStructuredD3Block } from "./types";

export function restructure(allYears: IInputYear[]): IStructuredD3Block[][] {
  const blocksGroupedByYear: IStructuredD3Block[][] = [];

  for (let i = 0; i < allYears.length; i++) {
    const currentYear = allYears[i]["year"];
    let allBlocksInCurrentYear: IStructuredD3Block[] = [];

    for (let j = 0; j < allYears[i].yomTovSets.length; j++) {
      const setName = allYears[i].yomTovSets[j]["yomTovName"];
      const setColor = allYears[i].yomTovSets[j]["color"] || "#444";

      const currentSetItem = allYears[i].yomTovSets[j];

      for (let m = 0; m < currentSetItem["days"].length; m++) {
        let block: IStructuredD3Block = {
          year: currentYear,
          yomTov: setName,
          yomTovIndex: j,
          yomTovColor: setColor,
          subYomTov: currentSetItem.yomTovName,
          subYomTovIndex: j,
          day: currentSetItem.days[m],
        };
        allBlocksInCurrentYear.push(block);
      }
    }
    blocksGroupedByYear.push(allBlocksInCurrentYear);
  }
  // console.log('blocksGroupedByYear', blocksGroupedByYear);
  return blocksGroupedByYear;
}
