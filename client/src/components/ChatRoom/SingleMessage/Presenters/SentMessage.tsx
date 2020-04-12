import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import Baloon from '../Baloon';
import { EmojiReactions } from '../../../Emoji';
import User from '../User';
import { domutil } from '../../../../utils';

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

const Portal = styled.div(({ top, left, theme }: { top: number, left: number, theme: any }) => `
    position : absolute;
    top : ${top}px;
    left : ${left}px;
`)

const SentMessage: React.FC<{
    className?: string,
    time: string,
    handleAddReaction: (reactionId: string) => void,
    onClickEdit: ()=>void,
    reactions: { [s: string]: string[] },
    message: string,
    sender: string
}> = ({
    className,
    time,
    handleAddReaction,
    onClickEdit,
    sender,
    message,
    reactions = {},
}) => {
        const ref = useRef<HTMLDivElement | null>(null);
        const [hover, setHover] = useState(false);
        const [rect, setRect] = useState<ReturnType<typeof domutil.calcRelativePosition>>();
        useEffect(() => {
            if (ref.current) {
                const domRect = domutil.calcRelativePosition(ref.current, domutil.getRelativeParent(ref.current));
                setRect(domRect);
            }

        }, []);
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
                        <Typography variant='caption' color='textSecondary'>{sender},{time}</Typography>
                    </div>
                    <div className='message-actions'>
                        {
                            hover && (
                                <React.Fragment>
                                    <IconButton className='action-button' onClick={onClickEdit}>
                                        <EditIcon fontSize='inherit' className='action-icon' />
                                    </IconButton>
                                    <IconButton className='action-button'>
                                        <ClearIcon fontSize='inherit' className='action-icon' />
                                    </IconButton>
                                </React.Fragment>
                            )
                        }
                    </div>
                </div>
                <Baloon message={message} />
            </div>
            <EmojiReactions className='reactions' readonly reactions={reactions} handleAddReaction={handleAddReaction} />
            {hover && rect && (
                <Portal top={rect.top + rect.height} left={rect.left}>

                </Portal>
            )}
        </Wrapper>)
    };


export default SentMessage;