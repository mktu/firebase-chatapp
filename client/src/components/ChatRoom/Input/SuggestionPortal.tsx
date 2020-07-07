import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { domutil } from '../../../utils';

const Wrapper = styled.div`
`;

const Portal: React.FC<{
    container: HTMLElement,
    children: React.ReactElement
}> = ({
    container,
    children
}) => {
        return ReactDOM.createPortal(children, container);
    }

const SuggestionWrapper = styled.div(({ bottom, left }: { bottom: number, left: number }) => `
    position : absolute;
    bottom : ${bottom}px;
    left : ${left}px;
`)


type Props = {
    className?: string,
    node?: HTMLElement,
    children : React.ReactElement
}

function SugestionPortal({
    className,
    node,
    children
}: Props) {
    let suggestionRect, container;
    if (node) {
        container = (node.ownerDocument?.body) || document.body;
        suggestionRect = domutil.calcRelativePosition(node, container);
    }
    return (
        <Wrapper className={className} >
            {container && suggestionRect && (
                <Portal container={container}>
                    <SuggestionWrapper
                        bottom={suggestionRect.bottom + suggestionRect.height}
                        left={suggestionRect.left}
                    >
                        {children}
                        {/* <Suggestion
                            suggestion={suggestion.profiles}
                            handleSelect={handleSelectMention}
                            onClose={onCloseSuggestion}
                            focus={focusSuggestion}
                            onLeaveFocus={onLeaveSuggenstionFocus}
                            startAt='bottom'
                        /> */}
                    </SuggestionWrapper>
                </Portal>

            )}
        </Wrapper>
    )
};

export default SugestionPortal;