import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

const Wrapper = styled.div`
    width : 100%;
    box-sizing: border-box;
    & >.search-header{
        display : flex;
        align-items : center;
    }
    & > .refinements-main{
        display : flex;
        align-items : center;
        & > .refinements-searchbox{
            display : flex;
            align-items: center;
            width : 100%;
        }
    }
    & >.search-option{
        width : 100%;
        padding : 0.5rem 0 ;
    }
    & > .refinements-detail{
        margin-top : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;

const RefinementMenu = styled.div`
    padding-top : ${({ theme }) => `${theme.spacing(0.5)}px`};
    display : flex;
    align-items : center;
`;

const SearchOptionButton = styled(Button)`
    width : 100%;
    background-color : rgba(17,41,62,0.08);
    color : rgba(0,0,0,0.52);
    display : flex;
    align-items : center;
    justify-content : flex-start;
`;

function Refinements({
    className,
    renderSearchBox,
    renderRoomMenu,
    renderSenderMenu,
}: {
    className?: string
    renderSearchBox: (className?: string) => React.ReactNode,
    renderRoomMenu: (className?: string) => React.ReactNode,
    renderSenderMenu: (className?: string) => React.ReactNode,
}) {
    const [showDetail, setShowDetail] = useState(false);
    const filterRoom = useMemo(() => renderRoomMenu('filter-room-menu'), [renderRoomMenu]);
    const filterSender = useMemo(() => renderSenderMenu('filter-sender-menu'), [renderSenderMenu]);
    return (
        <Wrapper className={className}>
            <div className='search-header'>
                <Typography variant='caption'>SEARCH MESSAGES</Typography>
            </div>
            <div className='refinements-main'>
                {renderSearchBox('refinements-searchbox')}
            </div>
            <div className='search-option'>
                <SearchOptionButton onClick={() => {
                    setShowDetail(prev => !prev);
                }}>
                    <ExpandMoreIcon />
                    Search option
                </SearchOptionButton>
            </div>
            <Collapse in={showDetail}>
                <div className='refinements-detail'>
                    <RefinementMenu >
                        {filterRoom}
                    </RefinementMenu>
                    <RefinementMenu >
                        {filterSender}
                    </RefinementMenu>
                </div>
            </Collapse>
        </Wrapper>
    )
}


export default Refinements;