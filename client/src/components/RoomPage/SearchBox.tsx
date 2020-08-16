import React　from 'react';
import styled, {css} from 'styled-components';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { Search } from '@material-ui/icons';


const WrapperBase = css`
    display : flex;
    align-items : center;
    width : 90%;
    & >.search-button{
        padding : 1px;
    }
    & >.searchbox-input{
        width : 100%;
        border : none;
        outline : none;
    }
`;

const FilterSearchBoxWrapper = styled(Paper)`
    background-color : rgba(255,255,255,0.82);
    padding : ${({ theme }) => `${theme.spacing(0.1)}px ${theme.spacing(1)}px`};
    ${WrapperBase};
`;

const ContactSearchBoxWrapper = styled(Paper)`
    background-color : rgba(0,0,0,0.82);
    padding : ${({ theme }) => `${theme.spacing(0.1)}px ${theme.spacing(1)}px`};
    ${WrapperBase};
    & >.search-button{
        color : rgba(255,255,255,0.82);
    }
    & >.searchbox-input{
        color : white;
    }
`;

function SearchBox({
    className,
    onChange,
    onSearch,
    value,
    placeholder,
    variant
}: {
    className?: string,
    onChange: (text: string) => void,
    onSearch?: ()=>void,
    value : string,
    placeholder ?: string,
    variant : 'contact' | 'filter'
}) {
    const Wrapper =  variant === 'contact' ? ContactSearchBoxWrapper : FilterSearchBoxWrapper;
    return (
        <Wrapper className={className}>
            <InputBase className='searchbox-input' placeholder={placeholder} value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
            />
            <IconButton className='search-button' onClick={onSearch}>
                <Search />
            </IconButton>
        </Wrapper>
    )
}


export default SearchBox;