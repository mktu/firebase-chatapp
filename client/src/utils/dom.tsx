export const getRelativeParent = (element: (HTMLElement | null)): HTMLElement | undefined => {
    if (!element) {
        return undefined;
    }

    const position = window
        .getComputedStyle(element)
        .getPropertyValue('position');

    if (position !== 'static') {
        return element;
    }

    return getRelativeParent(element.parentElement);
}

export const getScrollableParent = (element: (HTMLElement | null)):HTMLElement => {
    if (!element) {
        return document.body;
    }

    const overflow = window
        .getComputedStyle(element)
        .getPropertyValue('overflow');

    const overflowY = window
        .getComputedStyle(element)
        .getPropertyValue('overflow-y');

    if (overflow === 'scroll' || overflowY === 'scroll' ||
    overflow === 'auto' || overflowY === 'auto'
    ) {
        return element;
    }

    return getScrollableParent(element.parentElement);
}

export const calcRelativePosition = (portalElement: HTMLElement, parentElement?: HTMLElement) => {
    let relativeTop, relativeLeft, relativeBottom, relativeRight = 0;
    let relativeScrollLeft, relativeScrollWidth, relativeScrollTop, relativeScrollHeight = 0;
    let relativeScrollBottom, relativeScrollRight = 0;
    const portalRect = portalElement.getBoundingClientRect();
    if (parentElement) {
        relativeScrollLeft = parentElement.scrollLeft;
        relativeScrollWidth = parentElement.scrollWidth;
        relativeScrollTop = parentElement.scrollTop;
        relativeScrollHeight = parentElement.scrollHeight;
        relativeScrollBottom = parentElement.scrollHeight - parentElement.clientHeight;
        relativeScrollRight = parentElement.scrollWidth - parentElement.clientWidth;

        const relativeParentRect = parentElement.getBoundingClientRect();
        relativeLeft = portalRect.left - relativeParentRect.left;
        relativeTop = portalRect.top - relativeParentRect.top;
        relativeBottom = portalRect.bottom - relativeParentRect.bottom;
        relativeRight = portalRect.right - relativeParentRect.right;

    } else {
        relativeScrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        relativeScrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft;
        relativeScrollWidth = window.innerWidth;
        relativeScrollHeight = window.innerHeight;
        relativeScrollBottom = relativeScrollHeight - document.documentElement.clientHeight - relativeScrollTop;
        relativeScrollRight = relativeScrollWidth - document.documentElement.clientWidth - relativeScrollLeft;

        relativeTop = portalRect.top;
        relativeLeft = portalRect.left;
        relativeBottom = portalRect.bottom;
        relativeRight = portalRect.right;
    }
    const left = relativeLeft + relativeScrollLeft;
    const top = relativeTop + relativeScrollTop;
    const bottom = relativeBottom + relativeScrollBottom;
    const right = relativeRight + relativeScrollRight;
    
    //console.log(`relativeScrollHeight:${relativeScrollHeight},relativeScrollTop:${relativeScrollTop},bottom:${bottom},portalRect.bottom:${portalRect.bottom}`)
    // https://qiita.com/hoto17296/items/be4c1362647dd241905d
    const rect = {
        left,
        top,
        bottom,
        right,
        width: portalRect.width,
        height: portalRect.height
    }
    return rect;
}