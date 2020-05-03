import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import Popover from '@material-ui/core/Popover';
import Baloon from '../Baloon';
import { EmojiReactions } from '../../../Emoji';
import User from '../User';

const Wrapper = styled.div`
    display : flex;
    justify-content : flex-start;
    align-items : center;
    width : 100%;
    &>.message-wrapper{
        margin-left : ${({ theme }) => `${theme.spacing(1)}px`};
        >.message-header{
            display : flex;
            align-items : center;
            > .message-actions{
                margin-left : ${({ theme }) => `${theme.spacing(0.5)}px`};
                > .action-button{
                    padding : 0.5px;
                    font-size : 15px;
                    margin-right :  ${({ theme }) => `${theme.spacing(0.25)}px`};
                }
            }
            
        }
    }
    &>.reactions{
        display : flex;
        align-items : flex-end;
        margin-left : ${({ theme }) => `${theme.spacing(0.5)}px`};
    }
`;

const ConfirmationWrapper = styled.div`
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    display : flex;
    flex-direction : column;
    align-items : center;
    &>.delete-actions{
        margin-top : ${({ theme }) => `${theme.spacing(0.5)}px`};
    }
`;

const SentMessage: React.FC<{
    className?: string,
    time: string,
    handleAddReaction: (reactionId: string) => void,
    onClickEdit: () => void,
    onClickDelete: () => void,
    reactions: { [s: string]: string[] },
    message: string,
    sender: string,
    update?: boolean
}> = ({
    className,
    time,
    handleAddReaction,
    onClickDelete,
    onClickEdit,
    sender,
    message,
    reactions = {},
    update = false
}) => {
        const ref = useRef<HTMLDivElement | null>(null);
        const [hover, setHover] = useState(false);
        const [showConfirmation, setShowConfirmation] = useState(false);
        return (<Wrapper className={className} ref={ref} onMouseEnter={() => {
            setHover(true);
        }} onMouseLeave={() => {
            setHover(false);
        }}>
            <User>
                {sender[0]}
            </User>
            <div className='message-wrapper'>
                <div className='message-header'>
                    <div>
                        <Typography variant='caption' color='textSecondary'>{sender} {time} {update && 'UPDATED'}</Typography>
                    </div>
                    <div className='message-actions'>
                        {
                            hover && (
                                <React.Fragment>
                                    <IconButton className='action-button' onClick={onClickEdit}>
                                        <EditIcon fontSize='inherit' className='action-icon' />
                                    </IconButton>
                                    <IconButton className='action-button' onClick={() => {
                                        setShowConfirmation(true);
                                    }}>
                                        <ClearIcon fontSize='inherit' className='action-icon' />
                                    </IconButton>
                                </React.Fragment>
                            )
                        }
                    </div>
                </div>
                <Baloon message={message} />
            </div>
            <Popover
                open={showConfirmation}
                anchorEl={ref.current}
                onClose={() => {
                    setShowConfirmation(false);
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <ConfirmationWrapper>
                    <Typography>Are you sure you want to delete?</Typography>
                    <div className='delete-actions'>
                        <Button color='secondary' onClick={() => {
                            setShowConfirmation(false);
                            onClickDelete();
                        }}>DELETE</Button>
                        <Button variant='outlined' color='secondary' onClick={() => {
                            setShowConfirmation(false);
                        }}>CANCEL</Button>
                    </div>
                </ConfirmationWrapper>
            </Popover>
            <EmojiReactions className='reactions' readonly reactions={reactions} handleAddReaction={handleAddReaction} />
        </Wrapper>)
    };


export default SentMessage;