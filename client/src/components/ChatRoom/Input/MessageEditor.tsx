import React, { useCallback, useMemo, useContext, useEffect, useState } from 'react';
import ChatEditor, { KeyEvent } from '../../Editor';
import { useDropMultiFileState } from '../../../hooks/useDropImageState';
import { EditMessagePresenter } from './Presenters';
import { ImageSubmitDialog, ImageSumitContainer } from './ImageSubmitDialog';
import useChatTextState from './useChatTextState';
import Suggestion from './Suggestion';
import { ChatroomContext, UsersContext } from '../ChatroomContext';
import { ServiceContext } from '../../../contexts';
import { Message } from '../../../../../types/message';
import { FilePreviewList } from './FileList';

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
    const [images,setImages] = useState(message.images);
    useEffect(()=>{
        setImages(message.images);
    },[message.images])
    const messageId = message.id;
    const { dropZoneInputProps, dropZoneProps, fileUrls, clearFiles, files } = useDropMultiFileState();
    const { editMessage, disableMessage } = useContext(ServiceContext);
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
        if(!inputMessage && (!images || images.length === 0)){
            disableMessage(
                roomId,
                messageId
            );
            onSubmit();
        }else{
            editMessage(
                {
                    roomId,
                    messageId,
                    message : inputMessage || '',
                    mentions,
                    images
                }
            );
            clearInput();
            onSubmit();
        }
        
    }, [inputMessage, clearInput, editMessage, messageId, mentions, onSubmit, roomId, images,disableMessage])

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
                fileList={images && (
                    <FilePreviewList storedFiles={images} onDelete={(deleteImg)=>{
                        setImages(imgs=>{
                            return imgs?.filter(img=>img.url!==deleteImg.url)
                        })
                    }}/>
                )}
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
                    storedFiles={images}
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