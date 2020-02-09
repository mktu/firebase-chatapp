import { ContentBlock } from 'draft-js';
import { findMatches } from '../../logics/regexHelper';

export type StrategyCallback = (start: number, end: number) => void;

export function findWithRegex(
    regex: RegExp,
    contentBlock: ContentBlock,
    callback: StrategyCallback
) {
    const contentBlockText = contentBlock.getText();
    // exclude entities, when matching
    contentBlock.findEntityRanges(
        character => !character.getEntity(),
        (nonEntityStart, nonEntityEnd) => {
            const text = contentBlockText.slice(nonEntityStart, nonEntityEnd);
            const matches = findMatches(text,regex);
            for(const match of matches){
                const {start,end}=match;
                callback(nonEntityStart+start, nonEntityStart + end);
            }
        }
    );
}
