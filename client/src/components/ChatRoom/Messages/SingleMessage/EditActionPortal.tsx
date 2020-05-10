import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';

type Props = {
    onClickEdit: () => void,
    onClickDelete: () => void,
    left: number,
    bottom: number
}

type Pos = {
    bottom: number,
    left: number
}

const Wrapper = styled.div`
    position : absolute;
    min-width : 100px;
    > .action-button{
        padding : 0.5px;
        font-size : 15px;
        margin-right :  ${({ theme }) => `${theme.spacing(0.25)}px`};
    }
    ${({ bottom, left }: Pos) => `
        bottom : ${bottom}px;
        left : ${left}px;
    `}
    
`;

const EditActionPortal: React.FC<Props> = ({
    onClickEdit,
    onClickDelete,
    left,
    bottom
}) => {
    return (
        <Wrapper
            left={left}
            bottom={bottom}
        >
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