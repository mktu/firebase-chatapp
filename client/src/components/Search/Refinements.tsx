import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

const Wrapper = styled.div`
    width : 100%;
    box-sizing: border-box;
    padding : ${({ theme }) => `${theme.spacing(0.5)}px ${theme.spacing(1)}px`};
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
            width : 300px;
            margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
        }
    }
    & > .refinements-detail{
        margin-top : ${({ theme }) => `${theme.spacing(1)}px`};
       > .refinements-menu {
            display : flex;
            align-items : center;
       }
    }
`

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
                <Button color='secondary' onClick={() => {
                    setShowDetail(prev => !prev);
                }}>
                    <ExpandMoreIcon />
                    Search option
                </Button>
            </div>
            <Collapse in={showDetail}>
                <div className='refinements-detail'>
                    <div>
                        <Typography variant='caption'>FILTER</Typography>
                    </div>
                    <div className='refinements-menu'>
                        {filterRoom}
                    </div>
                    <div className='refinements-menu'>
                        {filterSender}
                    </div>
                </div>
            </Collapse>
        </Wrapper>
    )
}


export default Refinements;