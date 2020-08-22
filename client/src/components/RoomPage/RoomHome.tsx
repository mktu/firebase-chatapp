import React, {useContext} from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import CustomTheme, {ThemeType} from './ThemeContext';


type ThemeProps = {
    customtheme : ThemeType,
    theme : any
}
const Wrapper = styled.div`
    
`;

const MessageWrapper = styled.div`
    padding : ${({ theme }) => `${theme.spacing(4)}px`};
    background-color : ${({customtheme}:ThemeProps)=>`${customtheme.paper}`};
    color : ${({customtheme}:ThemeProps)=>`${customtheme.paperText}`};
    border-radius : ${({ theme }) => `${theme.shape.borderRadius}px`};
    > .title{
        margin-bottom :  ${({ theme }) => `${theme.spacing(2)}px`};
    }
`;

export default () => {
    const customTheme = useContext(CustomTheme);
    return (
        <Wrapper>
            <MessageWrapper customtheme={customTheme}>
                <Typography variant='h5' className='title'>Welcome Chat room</Typography>
                <Typography variant='body1'>Select an existing chat room or create a new chat room and start a conversation !</Typography>
            </MessageWrapper>
        </Wrapper>
    )
};