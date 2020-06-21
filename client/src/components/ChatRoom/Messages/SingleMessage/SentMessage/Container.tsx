import React, { useRef, useState, useMemo } from 'react';
import Baloon from '../Baloon';
import { EmojiReactions } from '../../../../Emoji';
import Presenter, { EditorStyle } from './Presenter';
import PortalPresenter from './PortalPresenter';
import ConfirmDeletePopover from '../ConfirmDeletePopover';
import EditActionPanel from '../EditActionPanel';
import Input, { EditMessagePresenter } from '../../../Input';
import User from '../User';
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
                avatar={(
                    <User imageUrl={sender.imageUrl}>
                        {sender.nickname[0]}
                    </User>
                )}
                baloon={(
                    <Baloon
                        message={message.message}
                        renderPortal={(rect) => (
                            <PortalPresenter
                                showEditActions={hover}
                                bottom={rect.bottom}
                                left={rect.left + rect.width}
                                renderEditActions={(style) => (
                                    <EditActionPanel
                                        className={style}
                                        onClickDelete={() => { setShowConfirmation(true) }}
                                        onClickEdit={() => { setEditable(true) }}
                                    />
                                )}
                                renderEmojiReactions={(style) => (
                                    <EmojiReactions
                                        className={style}
                                        readonly
                                        reactions={reactions} />
                                )}
                            />
                        )}
                    />
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