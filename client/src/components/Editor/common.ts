import { ContentBlock, EditorState, SelectionState } from 'draft-js';
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
            const matches = findMatches(text, regex);
            for (const match of matches) {
                const { start, end } = match;
                callback(nonEntityStart + start, nonEntityStart + end);
            }
        }
    );
}

export function serach(editorState: EditorState, regex: RegExp) {
    const blockMap = editorState.getCurrentContent().getBlockMap();
    let selections: SelectionState[] = [];
    blockMap.forEach((contentBlock) => (
        contentBlock && findWithRegex(regex, contentBlock, (start, end) => {
            const blockKey = contentBlock.getKey();
            const blockSelection = SelectionState
                .createEmpty(blockKey)
                .merge({
                    anchorOffset: start,
                    focusOffset: end,
                }) as SelectionState;
            selections.push(blockSelection)
        })
    ));
    return selections;
}
