import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';

type Props = {
    className?:string,
    onClickEdit: () => void,
    onClickDelete: () => void,
}


const Wrapper = styled.div`
    min-width : 100px;
    > .action-button{
        padding : 0.5px;
        font-size : 15px;
        margin-right :  ${({ theme }) => `${theme.spacing(0.25)}px`};
    }
`;

const EditActionPortal: React.FC<Props> = ({
    className,
    onClickEdit,
    onClickDelete,
}) => {
    return (
        <Wrapper className={className}>
            <IconButton className='action-button' onClick={onClickEdit}>
                <EditIcon fontSize='inherit' className='action-icon' />
            </IconButton>
            <IconButton className='action-button' onClick={onClickDelete}>
                <ClearIcon fontSize='inherit' className='action-icon' />
            </IconButton>
        </Wrapper>
    )
}

export default EditActionPortal;