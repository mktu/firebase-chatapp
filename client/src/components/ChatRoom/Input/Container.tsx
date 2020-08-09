import React, { useCallback, useMemo, useContext } from 'react';
import ChatEditor, { KeyEvent } from '../../Editor';
import { useDropMultiFileState } from '../../../hooks/useDropImageState';
import { ChatInputPresenter } from './Presenters';
import { ImageSubmitDialog, ImageSumitContainer } from './ImageSubmitDialog';
import useChatTextState from './useChatTextState';
import SuggestionPortal from './SuggestionPortal';
import Suggestion from './Suggestion';
import { MyProfileContext, UsersContext, ChatroomContext } from '../ChatroomContext';
import { ServiceContext } from '../../../contexts';

type Props = {
    className?: string,
    initText?: string,
    initMentions?: string[],
}

const Container = ({
    className,
    initText,
    initMentions = [],
}: Props) => {
    const { dropZoneInputProps, dropZoneProps, fileUrls, clearFiles, files } = useDropMultiFileState();
    const profiles  = useContext(UsersContext);
    const {id : roomId, contact, initContact }  = useContext(ChatroomContext);
    const shouldInitContact = contact ? !Boolean(initContact) : false;
    const {id : senderId, nickname : senderName}  = useContext(MyProfileContext);
    const { createMessage } = useContext(ServiceContext)
    const {
        inputMessage,
        mentions,
        focusSuggestion,
        suggestion,
        onChangeText,
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
        suggestionPlacement : 'above',
        initMentions,
    })

    const handleSubmitMessage = useCallback(() => {
        if (inputMessage) {
            createMessage({
                roomId,
                senderId,
                senderName,
                message:inputMessage,
                mentions,
                initContact: shouldInitContact
            });
            clearInput();
        }
    }, [inputMessage, senderId, senderName, roomId, clearInput, createMessage, mentions, shouldInitContact])

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
                initText={initText}
            />
        )
    }, [onChangeText, attachModifier, onMountMention, onChangeMentionCandidate, onKeyPress, initText])
    return (
        <React.Fragment>
            <ChatInputPresenter
                className={className}
                richEditor={richEditor}
                onSelectEmoji={onSelectEmoji}
                handleSubmitMessage={handleSubmitMessage}
                suggestion={
                    suggestion ?
                        <SuggestionPortal
                            node={suggestion.node}
                        >
                            <Suggestion
                                suggestion={suggestion.profiles}
                                handleSelect={handleSelectMention}
                                onClose={onCloseSuggestion}
                                focus={focusSuggestion}
                                onLeaveFocus={onLeaveSuggenstionFocus}
                                startAt='bottom'
                            />
                        </SuggestionPortal> : <div />
                }
                dropZoneRootProps={dropZoneProps}
                dropZoneInputProps={dropZoneInputProps}
            />
            <ImageSubmitDialog
                show={fileUrls.length > 0}
                onClose={clearFiles}
            >
                <ImageSumitContainer
                    files={files}
                    onClose={clearFiles}
                    onSubmit={(message, mentions, images) => {
                        createMessage({
                            roomId,
                            senderId,
                            senderName,
                            message,
                            mentions,
                            images,
                            initContact: shouldInitContact
                        });
                        clearInput();
                        clearFiles();
                    }}
                    profiles={profiles}
                    initText={inputMessage}
                    initMentions={mentions}
                />
            </ImageSubmitDialog>
        </React.Fragment>
    )
};

export default Container;