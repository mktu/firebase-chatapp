import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

const EmojiIconButton = styled(IconButton)`
    display : flex;
    justify-content : flex-end;
    align-items : start;
    ${({ theme }) => `
        padding : 2px;
        border-radius :${theme.shape.borderRadius}px;
        border : 1px solid ${theme.palette.divider};
        margin-right : ${theme.spacing(0.5)}px;
    `}
    &:hover{
        background-color : transparent;
    }
`;

export default EmojiIconButton;