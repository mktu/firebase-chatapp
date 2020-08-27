import React from 'react';
import styled, { keyframes } from 'styled-components';
import { types } from '../../InfiniteScrollable';
import { Spin1s200pxIcon } from '../../Icons';

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

const LoadingWrapper = styled.div`
    display : flex;
    height : 100%;
    width : 100%;
    align-items : center;
    justify-content : center;
`;

function Presenter({
    className,
    children,
    loading
}: {
    className?: string,
    children: (
        args: {
            classes: { [key in types.Classes]?: string }
        }
    ) => React.ReactElement,
    loading: boolean
}) {
    return (
        <Wrapper className={className} >
            {loading ? (
                <LoadingWrapper>
                    <Spin1s200pxIcon width='100'/>
                </LoadingWrapper>
            ) : (
                    <div className='messages-scrollable'>
                        {children({
                            classes: {
                                'root': 'messages-items',
                                'list-item': 'messages-item',
                                'focus-item': 'focus-message',
                                'notification': 'messages-notification'
                            }
                        })}
                    </div>
                )}

        </Wrapper >
    )
}

export default Presenter;