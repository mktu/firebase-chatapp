import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : space-between;

    > .room-name{
    display : flex;
    align-items : start;
    align-items : center;
        > .user-icon{
            margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
        }
        > .edit-roomname-button{
            margin : 0 0 5px 5px;
            padding : 1px;
            > .edit-roomname-icon{
                font-size : 15px;
            }
        }
    }
`;

type Props = {
    roomName: string,
    className?: string,
    avatar: React.ReactElement,
}

function HeaderPresenter({
    roomName,
    className,
    avatar,
}: Props) {
    return (
        <Wrapper className={className} >
            <div className='room-name'>
                <div className='user-icon'>
                    {avatar}
                </div>
                <Typography variant='h6' >{roomName}</Typography>
            </div>
        </Wrapper >
    )
};

export default HeaderPresenter;