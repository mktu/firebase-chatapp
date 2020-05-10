import React, { useRef, useState, useMemo } from 'react';
import Baloon from '../Baloon';
import { EmojiReactions } from '../../../../Emoji';
import Presenter, { EditorStyle } from './Presenter';
import ConfirmDeletePopover from '../ConfirmDeletePopover';
import EditActionPortal from '../EditActionPortal';
import Input, { EditMessagePresenter } from '../../../Input';
import { SentMessageProps } from '../../../types';
import { getDateAsString, getReactionsAsUserName } from '../../../utils';

const Container: React.FC<SentMessageProps> = ({
    className,
    profiles,
    message,
    sender,
    editMessage,
    disableMessage
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [hover, setHover] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const time = getDateAsString(message.update || message.date);
    const reactions = useMemo(() => getReactionsAsUserName(profiles, message.reactions), [profiles, message.reactions]);
    const [editable, setEditable] = useState(false);
    if (editable) {
        return (
            <EditorStyle>
                <Input
                    profiles={profiles}
                    submitMessage={(messageText, mentions) => {
                        editMessage(message.id, messageText, mentions);
                        setEditable(false);
                    }}
                    onCancel={() => { setEditable(false) }}
                    presenter={EditMessagePresenter}
                    initText={message.message}
                    initMentions={message.mentions}
                    suggestionPlacement='below'
                />
            </EditorStyle>
        )
    }
    return (
        <React.Fragment>
            <Presenter
                className={className}
                ref={ref}
                time={time}
                sender={sender.nickname}
                update={Boolean(message.update)}
                readCount={message.readers?.length}
                onMouseEnter={() => { setHover(true) }}
                onMouseLeave={() => { setHover(false) }}
                renderBaloon={() => (
                    <Baloon
                        message={message.message}
                        renderPortal={(rect) => {
                            if (!hover) return <div />;
                            return (
                                <EditActionPortal
                                    onClickDelete={() => { setShowConfirmation(true) }}
                                    onClickEdit={() => { setEditable(true) }}
                                    bottom={rect.bottom}
                                    left={rect.left+rect.width}
                                />
                            )
                        }}
                    />
                )}
                renderReactions={(style) => (
                    <EmojiReactions
                        className={style}
                        readonly
                        reactions={reactions} />
                )}
            />
            <ConfirmDeletePopover
                anchor={ref.current}
                open={showConfirmation}
                handleDelete={() => { disableMessage(message.id) }}
                onClose={() => { setShowConfirmation(false) }}
            />
        </React.Fragment>)
};


export default Container;