
export interface MatchedPart {
    text : string,
    start : number,
    end : number
}

export const findMatches = (source:string, regex:RegExp) =>{
    let matchArr;
    let prevLastIndex = regex.lastIndex;
    let results : MatchedPart[] = [];

    // Go through all matches in the text and return the indices to the callback
    // Break the loop if lastIndex is not changed
    while ((matchArr = regex.exec(source)) !== null) {
        // eslint-disable-line
        if (regex.lastIndex === prevLastIndex) {
            break;
        }
        prevLastIndex = regex.lastIndex;
        const start = matchArr.index;
        const end = start + matchArr[0].length;
        results.push({
            text : source.substring(start, end),
            start,
            end
        })
    }
    return results;
}