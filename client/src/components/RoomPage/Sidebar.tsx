import React from 'react';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import SmsIcon from '@material-ui/icons/Sms';
import Tooltip from '@material-ui/core/Tooltip';
import GroupIcon from '@material-ui/icons/Group';

export type SidebarSelection = 'room' | 'contact'

type Props = {
    selected: SidebarSelection,
    onSelect: (selected: SidebarSelection) => void
};

const Wrapper = styled.div`
    height : 100%;
    padding-top : 50px;
    box-sizing: border-box;
    > div{
        display : flex;
        align-items : center;
        justify-content : center;
        margin-bottom : 2em;
    }
`;

const IconWrapper = styled.div`
    color : ${({ focus }: { focus: boolean }) => focus ? `rgba(255,255,255,0.9)` : `rgba(255,255,255,0.52)`};
    font-size : 3.5em;
`;

export default ({
    selected,
    onSelect
}: Props) => {

    return (
        <Wrapper>
            <div>
                <Tooltip title='Chat Rooms'>
                    <ButtonBase disableRipple onClick={() => {
                        onSelect('room')
                    }}>
                        <IconWrapper focus={selected === 'room'}>
                            <SmsIcon color='inherit' fontSize='inherit' />
                        </IconWrapper>
                    </ButtonBase>
                </Tooltip>
            </div>
            <div>
                <Tooltip title='Contacts'>
                    <ButtonBase disableRipple onClick={() => {
                        onSelect('contact')
                    }}>
                        <IconWrapper focus={selected === 'contact'}>
                            <GroupIcon color='inherit' fontSize='inherit' />
                        </IconWrapper>
                    </ButtonBase>
                </Tooltip>
            </div>
        </Wrapper>
    )
};