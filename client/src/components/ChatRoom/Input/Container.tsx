import React, { useCallback, useMemo, useContext } from 'react';
import ChatEditor, { KeyEvent } from '../../Editor';
import { useDropMultiImageState } from '../../../hooks/useDropImageState';
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
    const { dropZoneInputProps, dropZoneProps, imgUrls, clearImages, imageFiles } = useDropMultiImageState();
    const profiles  = useContext(UsersContext);
    const {id : roomId}  = useContext(ChatroomContext);
    const {id : senderId, nickname : senderName}  = useContext(MyProfileContext);
    const { createMessage, uploadMessageImage } = useContext(ServiceContext)
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
                mentions
            });
            clearInput();
        }
    }, [inputMessage, senderId, senderName, roomId, clearInput, createMessage, mentions])

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
                show={imgUrls.length > 0}
                onClose={clearImages}
            >
                <ImageSumitContainer
                    images={imageFiles}
                    onClose={clearImages}
                    onSubmit={(message, mentions, images) => {
                        if(images.length > 0){
                            const promises = images.map((image)=>{
                                return uploadMessageImage(senderId, image, (progress)=>{
                                    console.log(`${image.name}:${progress}`);
                                })
                            });
                            Promise.all(promises).then((imageUrls)=>{
                                createMessage({
                                    roomId,
                                    senderId,
                                    senderName,
                                    message,
                                    mentions,
                                    imageUrls
                                });
                                clearInput();
                                clearImages();
                            })
                            
                        }
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