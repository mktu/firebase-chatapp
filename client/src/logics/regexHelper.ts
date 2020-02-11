
export interface MatchedPart {
    text: string,
    start: number,
    end: number
}

export const findMatches = (source: string, regex: RegExp) => {
    let matchArr;
    let prevLastIndex = regex.lastIndex;
    let results: MatchedPart[] = [];

    while ((matchArr = regex.exec(source)) !== null) {
        if (regex.lastIndex === prevLastIndex) {
            break;
        }
        prevLastIndex = regex.lastIndex;
        const start = matchArr.index;
        const end = start + matchArr[0].length;
        results.push({
            text: source.substring(start, end),
            start,
            end
        })
    }
    return results;
}

export interface MatchInfo {
    text: string,
    matched: boolean
}

export const buildMatchInfo = (source: string, regex: RegExp) => {
    const parts = findMatches(source, regex);
    const results: MatchInfo[] = [];
    let next = 0;
    for (const part of parts) {
        if (part.start > 0) {
            results.push({
                text: source.substring(next, part.start),
                matched: false
            })
        }
        results.push({
            text: source.substring(part.start, part.end),
            matched: true
        });
        next = part.end;
    }
    if (next < source.length) {
        results.push({
            text: source.substring(next),
            matched: false
        });
    }

    return results;
}