import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const Wrapper = styled.div`
    transition: all 0.1s ease-out;
    display : flex;
    align-items : center;
    justify-content : center;
    ${({ show }: { show: boolean }) => show ? `
        bottom : 10px;
    ` : `
        bottom : 0px;
    `}
    
    & > .message-notofication{
        ${({ show, theme }: { show: boolean, theme: any }) => show ? `
            width : auto;
            background-color : ${theme.palette.info.light};
            border-radius : ${theme.shape.borderRadius}px;
            color : ${theme.palette.info.contrastText};
            box-shadow : ${theme.shadows[2]};
            padding : ${theme.spacing(1)}px;
            cursor : pointer;
            &: hover {
                background-color : ${theme.palette.info.main};
            }
        ` : `
            width : 0;
            height : 0;
            padding : 0;

        `}
    }
`;

const Notification: React.FC<{
    className?: string,
    onClick: () => void,
    show: boolean
}> = ({
    className,
    onClick,
    show
}) => {
        return (
            <Wrapper show={show} className={className}>
                <Button variant='contained' className='message-notofication' onClick={onClick}>
                    {show && (<React.Fragment>
                        <ArrowDownwardIcon />
                        NEW MESSGAE
                    </React.Fragment>)}
                </Button>
            </Wrapper>
        )
    };

export default Notification;