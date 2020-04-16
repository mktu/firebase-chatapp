import React, { useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import { Emoji } from 'emoji-mart'
import Tooltip from '@material-ui/core/Tooltip';
import EmojiIconButton from './EmojiIconButton';

const EmojiReactions = ({ reactions, className, handleAddReaction = () => { }, readonly = false }: {
    reactions: { [s: string]: string[] },
    className?: string,
    readonly?: boolean,
    handleAddReaction?: (reactionId: string) => void
}) => {
    const reactionIds = useMemo(() => Object.keys(reactions), [reactions]);
    return useMemo(() => (
        <div className={className}>
            {reactionIds.map(id => (
                <Tooltip key={id} title={reactions[id].map(name => (
                    <div>{name}</div>
                ))} placement="top">
                    <div>
                        <EmojiIconButton disabled={readonly} key={id} onClick={() => {
                            handleAddReaction(id);
                        }}>
                            <Emoji emoji={id} size={16} />
                            <Typography variant='caption' color='textSecondary'>{reactions[id].length}</Typography>
                        </EmojiIconButton>
                    </div>
                </Tooltip>
            ))}
        </div>
    ), [reactions, className, handleAddReaction, readonly, reactionIds]);
}


export default EmojiReactions;

