import React, { useCallback, useMemo, useContext } from 'react';
import ChatEditor, { KeyEvent } from '../../Editor';
import { useDropMultiFileState } from '../../../hooks/useDropImageState';
import { EditMessagePresenter } from './Presenters';
import { ImageSubmitDialog, ImageSumitContainer } from './ImageSubmitDialog';
import useChatTextState from './useChatTextState';
import Suggestion from './Suggestion';
import { ChatroomContext, UsersContext } from '../ChatroomContext';
import { ServiceContext } from '../../../contexts';
import { Message } from '../../../../../types/message';

type Props = {
    className?: string,
    onSubmit: () => void,
    onCancel?: () => void,
    message : Message,
    suggestionPlacement?: 'above' | 'below'
}

const Container = ({
    className,
    onSubmit,
    onCancel,
    message,
}: Props) => {
    const messageId = message.id;
    const { dropZoneInputProps, dropZoneProps, fileUrls, clearFiles, files } = useDropMultiFileState();
    const { editMessage } = useContext(ServiceContext);
    const { id: roomId } = useContext(ChatroomContext);
    const profiles = useContext(UsersContext);
    const {
        inputMessage,
        mentions,
        focusSuggestion,
        suggestion,
        onChangeText,
        onCancelInput,
        onSelectEmoji,
        attachModifier,
        onChangeMentionCandidate,
        handleSelectMention,
        onMountMention,
        onLeaveSuggenstionFocus,
        onCloseSuggestion,
        clearInput,
        onKeyPress: handleKeyEvent,
    } = useChatTextState({
        profiles,
        onCancel,
        suggestionPlacement: 'below',
        initMentions : message.mentions,
    })

    const handleSubmitMessage = useCallback(() => {
        if (inputMessage) {
            editMessage(
                {
                    roomId,
                    messageId,
                    message : inputMessage,
                    mentions,
                    images : message.images
                }
            );
            clearInput();
            onSubmit();
        }
    }, [inputMessage, clearInput, editMessage, messageId, mentions, onSubmit, roomId, message.images])

    const onKeyPress = useCallback((key: KeyEvent) => {
        if (key === 'CtrlEnter') {
            handleSubmitMessage();
        }
        handleKeyEvent(key)
    }, [handleKeyEvent, handleSubmitMessage]);


    const richEditor = useMemo(() => {
        return (
            <ChatEditor
                attachModifier={attachModifier}
                onChangeText={onChangeText}
                onMountMention={onMountMention}
                onChangeMentionCandidate={onChangeMentionCandidate}
                onKeyPress={onKeyPress}
                initText={message.message}
            />
        )
    }, [onChangeText, attachModifier, onMountMention, onChangeMentionCandidate, onKeyPress, message.message])

    return (
        <React.Fragment>
            <EditMessagePresenter
                className={className}
                richEditor={richEditor}
                onSelectEmoji={onSelectEmoji}
                handleSubmitMessage={handleSubmitMessage}
                suggestion={
                    suggestion ? <Suggestion
                        suggestion={suggestion.profiles}
                        handleSelect={handleSelectMention}
                        focus={focusSuggestion}
                        onLeaveFocus={onLeaveSuggenstionFocus}
                        onClose={onCloseSuggestion}
                        startAt='top'
                        variant='small'
                    /> : <div />
                }
                onCancel={onCancelInput}
                dropZoneRootProps={dropZoneProps}
                dropZoneInputProps={dropZoneInputProps}
            />
            <ImageSubmitDialog
                show={fileUrls.length > 0}
                onClose={clearFiles}
            >
                <ImageSumitContainer
                    files={files}
                    storedFiles={message.images}
                    onClose={clearFiles}
                    onSubmit={(message, mentions, images) => {
                        editMessage({
                            roomId,
                            messageId,
                            message,
                            mentions,
                            images
                        });
                        clearInput();
                        clearFiles();
                        onSubmit();
                    }}
                    profiles={profiles}
                    onCancel={onCancel}
                    initText={inputMessage}
                    initMentions={mentions}
                />
            </ImageSubmitDialog>
        </React.Fragment>
    )
};

export default Container;