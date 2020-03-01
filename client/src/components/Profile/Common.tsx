import styled from 'styled-components';
import PaperBase from '@material-ui/core/Paper';

export const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : center;
    padding : 2rem;
`;

export const Paper = styled(PaperBase)`
    width : 60%;
    padding : 1rem;
    & > .content{
        margin-bottom : 1rem;
        margin-top : 1rem;
    }
    & > .content > .notification {
        margin-bottom : 1rem;
    }
    & > .submit-actions{
        display : flex;
        justify-content : flex-end;
    }
`