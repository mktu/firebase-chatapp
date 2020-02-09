import React from 'react';
import {
    ContentBlock,
    ContentState,
    CharacterMetadata,
} from 'draft-js';
import { LinkPreview } from '../LinkPreview';
import { StrategyCallback } from './common';

const createLinkComponent = () => {
    const Link: React.FC<{
        contentState: ContentState,
        entityKey: string
    }> = ({ contentState, entityKey, children }) => {

        const { url } = contentState.getEntity(entityKey).getData();

        return (
            <React.Fragment>
                <a href={url} target='_blank' rel="noopener noreferrer">
                    {children}
                </a>
                <LinkPreview url={url} />
            </React.Fragment>
        );
    };
    return Link;
}

function findLinkStrategy(
    contentBlock: ContentBlock,
    callback: StrategyCallback,
    contentState: ContentState
) {
    contentBlock.findEntityRanges(
        (character: CharacterMetadata) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}

export { createLinkComponent,findLinkStrategy }