import React, { useRef, useState, useMemo } from 'react';
import Baloon from '../Baloon';
import { EmojiReactions, AddEmojiReaction } from '../../../../Emoji';
import Presenter from './Presenter';
import { ReceivedMessageProps } from '../../../types';
import { getDateAsString, getReactionsAsUserName } from '../../../utils';
import User from '../User';
import FileImage from '../FileImage';

const Container: React.FC<ReceivedMessageProps> = ({
    className,
    profiles,
    message,
    sender,
    me,
    addReaction
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [hover, setHover] = useState(false);
    const time = getDateAsString(message.update || message.date);
    const reactions = useMemo(() => getReactionsAsUserName(profiles, message.reactions), [profiles, message.reactions]);

    return (
        <React.Fragment>
            <Presenter
                className={className}
                ref={ref}
                time={time}
                sender={sender?.nickname || 'Unknown'}
                update={Boolean(message.update)}
                images={
                    <FileImage
                        pos='right'
                        images={message.images}
                    />
                }
                onMouseEnter={() => {
                    setHover(true);
                }}
                onMouseLeave={() => {
                    setHover(false);
                }}
                baloon={(
                    <Baloon
                        message={message.message}
                    />
                )}
                avatar={(
                    <User imageUrl={sender?.imageUrl}>
                        {sender?.nickname[0] || '-'}
                    </User>
                )}
                reactionAdder={!hover ? (
                    <div />
                ) : (
                        <AddEmojiReaction
                            handleAddReaction={(reactionId) => {
                                addReaction(message.id, reactionId, me.id);
                            }}
                        />
                    )
                }
                renderReactions={(style) => (
                    <EmojiReactions
                        className={style}
                        reactions={reactions}
                        handleAddReaction={(reactionId) => {
                            addReaction(message.id, reactionId, me.id);
                        }}
                    />
                )}
            />
        </React.Fragment>)
};


export default Container;