import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

type PropsType = {
    open: boolean,
    anchor: null | Element,
    onClose: () => void,
    handleDelete: () => void,
}

const Wrapper = styled.div`
    padding : ${({ theme }) => `${theme.spacing(1)}px`};
    display : flex;
    flex-direction : column;
    align-items : center;
    &>.delete-actions{
        margin-top : ${({ theme }) => `${theme.spacing(0.5)}px`};
    }
`;

const ConfirmDeletePopover: React.FC<PropsType> = ({
    open,
    anchor,
    onClose,
    handleDelete
}) => {
    return (
        <Popover
            open={open}
            anchorEl={anchor}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <Wrapper>
                <Typography>Are you sure you want to delete?</Typography>
                <div className='delete-actions'>
                    <Button color='secondary' onClick={() => {
                        onClose();
                        handleDelete();
                    }}>DELETE</Button>
                    <Button variant='outlined' color='secondary' onClick={onClose}>CANCEL</Button>
                </div>
            </Wrapper>
        </Popover>
    )
}

export default ConfirmDeletePopover;