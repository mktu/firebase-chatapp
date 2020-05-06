import React from 'react';
import styled from 'styled-components';
import { MenuProvided } from 'react-instantsearch-core';

const Wrapper = styled.div`
    overflow: hidden;
    width: 30%;
    margin : ${({ theme }) => `${theme.spacing(1)}`};
    text-align: center;
    position: relative;
	border: 1px solid ${({ theme }) => `${theme.palette.divider}`};
	border-radius: 2px;
	background: ${({ theme }) => `${theme.palette.background.paper}`};
    & > select{
        width: 100%;
        padding-right: 1em;
        cursor: pointer;
        text-indent: 0.01px;
        text-overflow: ellipsis;
        border: none;
        outline: none;
        background: transparent;
        background-image: none;
        box-shadow: none;
        -webkit-appearance: none;
        appearance: none;
        padding: 8px 38px 8px 8px;
	    color: ${({ theme, hiddenColor }:{theme:any,hiddenColor:boolean}) => hiddenColor?`${theme.palette.text.hint}`:`${theme.palette.text.primary}`};
        :-ms-expand{
            display: none;
        }
    }

    &:before{
        position: absolute;
        top: 0.8em;
        right: 0.9em;
        width: 0;
        height: 0;
        padding: 0;
        content: '';
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #666666;
        pointer-events: none;
    }
    &:after{
        position: absolute;
        top: 0;
        right: 2.5em;
        bottom: 0;
        width: 1px;
        content: '';
        border-left: 1px solid ${({ theme }) => `${theme.palette.divider}`};
    }
`;

type PropsType = {
    className?: string,
    label?: string
} & MenuProvided;

const Menu: React.FC<PropsType> = ({
    refine,
    items,
    label,
    currentRefinement,
    className
}) => {
    return (
        <Wrapper className={className} hiddenColor={!currentRefinement || currentRefinement===''}>
            <select required onChange={(e) => {
                refine(e.target.value)
            }}
                value={currentRefinement||''}
            >
                <option value="" hidden>{label}</option>
                {items.map(item => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>))}
            </select>
        </Wrapper>
    )
};

export default Menu;