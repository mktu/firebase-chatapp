import React, { useMemo } from 'react';
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
import useChatTextState from './useChatTextState';


type Props = {
    images: File[],
    initText?: string,
    onClose: () => void,
    onSubmit: (message: string, mentions: string[], images: File[]) => void,
    profiles: Profile[],
    onCancel?: () => void,
    initMentions?: string[],
};

const ImageDialogTitle = styled(DialogTitle)`
    background-color : ${({ theme }) => `${theme.palette.primary.main}`};
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    color : white;
`;

const ImageContent = styled.div`
    > .image-src{
        display : flex;
        align-items : center;
        justify-content : center;
    }
    > .image-description{
        display : flex;
        flex-direction : column;
        align-items : flex-end;
        justify-content : center;
        font-size : 0.8rem;
        padding: ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;

const Img = styled.img`
    max-width : 90%;
    height : auto;
`;

function ImageSumitContainer({
    images,
    profiles,
    onCancel,
    onClose,
    initMentions,
    onSubmit,
    initText
}: Props) {

    const imageComps = useMemo(() => {
        return (
            <div>
                {images.map(image => {
                    const imageUrl = URL.createObjectURL(image);
                    return (
                        <ImageContent key={imageUrl}>
                            <div className='image-src'>
                                <Img src={imageUrl} />
                            </div>
                            <div className='image-description'>
                                <div>{image.name}</div>
                                <div>{image.size / 1000} KB</div>
                            </div>
                        </ImageContent>
                    )
                })}
            </div>
        )
    }, [images])
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
        suggestionPlacement : "below",
        initMentions,
    })

    return (
        <React.Fragment>
            <ImageDialogTitle>SUBMIT IMAGE</ImageDialogTitle>
            <DialogContent>
                <ImageSubmitPresenter
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
                    images={imageComps}
                    onSelectEmoji={onSelectEmoji}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    onSubmit(inputMessage || '', mentions, images)
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