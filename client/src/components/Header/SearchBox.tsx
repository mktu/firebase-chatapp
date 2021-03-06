import React, { useState } from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { Search } from '@material-ui/icons';
import { DefaultSize, MobileSize } from '../../utils/responsive';


const Wrapper = styled(Paper)`
    margin-left : ${({ theme }) => `${theme.spacing(2)}px`};
    display : flex;
    align-items : center;
    padding : ${({ theme }) => `${theme.spacing(0.5)}px ${theme.spacing(1)}px`};
    width : 30vw;
    & >.search-button{
        padding : 1px;
    }
    & >.searchbox-input{
        width : 100%;
        border : none;
        outline : none;
    }
`;

function SearchBox({
    className,
    handleSubmit
}: {
    className?: string,
    handleSubmit: (text: string) => void
}) {
    const [text, setText] = useState('');
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }
    const onKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') { // enter
            text !== '' && handleSubmit(text);
        }
    }
    return (
        <Wrapper className={className}>
            <DefaultSize>
                <InputBase className='searchbox-input' placeholder='Search messages' value={text}
                    onChange={onChange}
                    onKeyPress={onKeyPress}
                />
            </DefaultSize>
            <MobileSize>
                <InputBase className='searchbox-input' value={text}
                    onChange={onChange}
                    onKeyPress={onKeyPress}
                />
            </MobileSize>
            <IconButton className='search-button' onClick={() => {
                text !== '' && handleSubmit(text);
            }}>
                <Search />
            </IconButton>
        </Wrapper>
    )
}


export default SearchBox;