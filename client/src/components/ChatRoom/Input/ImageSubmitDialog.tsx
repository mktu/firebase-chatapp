import React, { useMemo, useContext, useState } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ChatEditor from '../../Editor';
import { ImageSubmitPresenter } from './Presenters';
import Suggestion from './Suggestion';
import { Profile } from '../../../../../types/profile';
import { MessageImage } from '../../../../../types/message';
import useChatTextState from './useChatTextState';
import { MyProfileContext } from '../ChatroomContext';
import { ServiceContext } from '../../../contexts';
import { ImageList, FileList } from './FileList';

type Props = {
    files: File[],
    storedFiles?: MessageImage[],
    initText?: string,
    onClose: () => void,
    onSubmit: (message: string, mentions: string[], images: MessageImage[]) => void,
    profiles: Profile[],
    onCancel?: () => void,
    initMentions?: string[],
};


const ImageDialogTitle = styled(DialogTitle)`
    background-color : ${({ theme }) => `${theme.palette.primary.main}`};
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    color : white;
`;


function ImageSumitContainer({
    files,
    storedFiles,
    profiles,
    onCancel,
    onClose,
    initMentions,
    onSubmit,
    initText
}: Props) {
    const [progress, setProgress] = useState<{ [key: string]: number }>();
    const { id: senderId } = useContext(MyProfileContext);
    const { uploadMessageImage } = useContext(ServiceContext);
    const imageList = useMemo(() => {
        return <ImageList files={files} storedFiles={storedFiles}/>;
    }, [files,storedFiles]);

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
        onKeyPress,
        onLeaveSuggenstionFocus,
        onCloseSuggestion,
    } = useChatTextState({
        profiles,
        onCancel,
        suggestionPlacement: "below",
        initMentions,
    })

    return (
        <React.Fragment>
            <ImageDialogTitle>SUBMIT IMAGE</ImageDialogTitle>
            <DialogContent>
                <ImageSubmitPresenter
                    fileList={
                        <FileList files={files} uploadProgresses={progress} storedFiles={storedFiles}/>
                    }
                    richEditor={
                        <ChatEditor
                            attachModifier={attachModifier}
                            onChangeText={onChangeText}
                            onMountMention={onMountMention}
                            onChangeMentionCandidate={onChangeMentionCandidate}
                            onKeyPress={onKeyPress}
                            initText={initText}
                        />
                    }
                    suggestion={
                        suggestion ?
                            <Suggestion
                                suggestion={suggestion.profiles}
                                handleSelect={handleSelectMention}
                                onClose={onCloseSuggestion}
                                focus={focusSuggestion}
                                onLeaveFocus={onLeaveSuggenstionFocus}
                                startAt='top'
                                variant='small'
                            /> : <div />
                    }
                    images={imageList}
                    onSelectEmoji={onSelectEmoji}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    if (files.length > 0) {
                        const promises = files.map((image) => {
                            return uploadMessageImage(senderId, image, (progress) => {
                                setProgress(prev => ({
                                    ...prev,
                                    [image.name]: progress
                                }))
                            })
                        });
                        Promise.all(promises).then((imageUrls) => {
                            const uploadImages = imageUrls.map((url,idx)=>({
                                url, 
                                name : files[idx].name, 
                                size : files[idx].size,
                                type : files[idx].type,
                            }))
                            onSubmit(inputMessage || '', mentions, uploadImages)
                        })
                    }
                }} color="primary">
                    SUBMIT
                </Button>
                <Button onClick={onClose} >
                    CLOSE
                </Button>
            </DialogActions>
        </React.Fragment >
    );
};

type DialogProps = {
    children: React.ReactElement,
    show: boolean,
    onClose: () => void
}

const ImageSubmitDialog: React.FC<DialogProps> = ({
    children,
    onClose,
    show
}) => (
        <Dialog fullWidth maxWidth='sm' open={show} onClose={onClose}>
            {children}
        </Dialog>
    )

export {
    ImageSumitContainer,
    ImageSubmitDialog
}