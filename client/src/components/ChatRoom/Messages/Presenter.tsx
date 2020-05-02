import React from 'react';
import styled, { keyframes } from 'styled-components';
import { types } from '../../InfiniteScrollable';
import { LoadingStatusType } from '../../../constants';

const focusAnimation = keyframes`
    0% {
        background-color : rgba(0,0,0,0);
    }
    50% {
        background-color : rgba(0,0,0,0.04);
    }
    100% {
        background-color : rgba(0,0,0,0);
    }
`;

const Wrapper = styled.div`
    position : relative;
    & > .messages-scrollable{
        overflow : auto;
        height : 100%;
        > .messages-items{
            > .focus-message{
                animation: ${focusAnimation} 3s 0s both;
            }
        }
        > .messages-notification{
            position : absolute;
            left: 0;
            right: 0;
            margin: auto;
        }
    }
`;

function Presenter({
    className,
    children,
    loadingStatus
}: {
    className?: string,
    loadingStatus : LoadingStatusType,
    children: (
        args: {
            classes: {[key in types.Classes]? : string}
        }
    ) => React.ReactElement,
}) {
    if(loadingStatus==='loading'){
        return (<div>loading messages...</div>);
    }
    if(loadingStatus==='failed'){
        return (<div>loading error</div>);
    }
    return (
        <Wrapper className={className} >
            <div className='messages-scrollable'>
                {children({
                    classes : {
                        'root': 'messages-items',
                        'list-item': 'messages-item',
                        'focus-item': 'focus-message',
                        'notification' : 'messages-notification'
                    }
                })}
            </div>
        </Wrapper >
    )
}

export default Presenter;