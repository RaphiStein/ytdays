import { IInputYear, IStructuredD3Block } from './types';

export function restructure (allYears: IInputYear[]): IStructuredD3Block[][] {
    const blocksGroupedByYear: IStructuredD3Block[][] = [];

    for (let i = 0; i < allYears.length; i++) {
      const currentYear = allYears[i]['year'];
      let allBlocksInCurrentYear: IStructuredD3Block[] = [];

      for (let j = 0; j < allYears[i]['sets'].length; j++){
        const setName = allYears[i]['sets'][j]['setName'];
        const setColor = allYears[i]['sets'][j]['color'] || '#444';

        for (let k = 0; k < allYears[i]['sets'][j]['setItems'].length; k++){
          //console.log(allYears[i]['sets'][j]['setItems'][k]);

          for (let m = 0; m < allYears[i]['sets'][j]['setItems'][k]['days'].length; m++){
            let block: IStructuredD3Block = {
              year: currentYear,
              yomTov: setName,
              yomTovIndex: j,
              yomTovColor: setColor,
              subYomTov: allYears[i]['sets'][j]['setItems'][k].name,
              subYomTovIndex: k,
              day: allYears[i]['sets'][j]['setItems'][k].days[m]
            }
            allBlocksInCurrentYear.push(block);
          }
        }
      }
      blocksGroupedByYear.push(allBlocksInCurrentYear);
    }
    console.log('blocksGroupedByYear', blocksGroupedByYear);
    return blocksGroupedByYear;
  }



