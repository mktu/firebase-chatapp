import React, { useCallback, useMemo, useContext } from 'react';
import ChatEditor, { KeyEvent } from '../../Editor';
import { useDropMultiImageState } from '../../../hooks/useDropImageState';
import { EditMessagePresenter } from './Presenters';
import { ImageSubmitDialog, ImageSumitContainer } from './ImageSubmitDialog';
import useChatTextState from './useChatTextState';
import Suggestion from './Suggestion';
import { MyProfileContext, ChatroomContext, UsersContext } from '../ChatroomContext';
import { ServiceContext } from '../../../contexts';

type Props = {
    className?: string,
    messageId: string,
    onSubmit: () => void,
    onCancel?: () => void,
    initText?: string,
    initMentions?: string[],
    suggestionPlacement?: 'above' | 'below'
}

const Container = ({
    className,
    messageId,
    onSubmit,
    onCancel,
    initText,
    initMentions = [],
}: Props) => {
    const { dropZoneInputProps, dropZoneProps, imgUrls, clearImages, imageFiles } = useDropMultiImageState();
    const { editMessage, uploadMessageImage } = useContext(ServiceContext);
    const { id: roomId } = useContext(ChatroomContext);
    const { id: profileId } = useContext(MyProfileContext);
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
        initMentions,
    })

    const handleSubmitMessage = useCallback(() => {
        if (inputMessage) {
            editMessage(
                {
                    roomId,
                    messageId,
                    message : inputMessage,
                    mentions
                }
            );
            clearInput();
            onSubmit();
        }
    }, [inputMessage, clearInput, editMessage, messageId, mentions, onSubmit, roomId])

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
                show={imgUrls.length > 0}
                onClose={clearImages}
            >
                <ImageSumitContainer
                    images={imageFiles}
                    onClose={clearImages}
                    onSubmit={(message, mentions, images) => {
                        if(images.length>0){
                            const promises = images.map((image)=>{
                                return uploadMessageImage(profileId, image, (progress)=>{
                                    console.log(`${image.name}:${progress}`);
                                })
                            });
                            Promise.all(promises).then((imageUrls)=>{
                                editMessage({
                                    roomId,
                                    messageId,
                                    message,
                                    mentions,
                                    imageUrls
                                });
                                clearInput();
                                clearImages();
                                onSubmit();
                            })
                        }
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