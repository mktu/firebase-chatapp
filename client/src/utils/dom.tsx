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

export const calcRelativePosition = (portalElement: HTMLElement, parentElement?: HTMLElement) => {
    let relativeTop, relativeLeft = 0;
    let relativeScrollLeft, relativeScrollWidth, relativeScrollTop, relativeScrollHeight = 0;
    const portalRect = portalElement.getBoundingClientRect();
    if (parentElement) {
        relativeScrollLeft = parentElement.scrollLeft;
        relativeScrollWidth = parentElement.scrollWidth;
        relativeScrollTop = parentElement.scrollTop;
        relativeScrollHeight = parentElement.scrollHeight;


        const relativeParentRect = parentElement.getBoundingClientRect();
        relativeLeft = portalRect.left - relativeParentRect.left;
        relativeTop = portalRect.top - relativeParentRect.top;
        
    } else {
        relativeScrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        relativeScrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft;
        relativeScrollWidth = window.innerWidth;
        relativeScrollHeight = window.innerHeight;

        relativeTop = portalRect.top;
        relativeLeft = portalRect.left;
    }
    console.log(`relativeScrollHeight:${relativeScrollHeight},relativeScrollTop:${relativeScrollTop}`)
    const left = relativeLeft + relativeScrollLeft;
    const top = relativeTop + relativeScrollTop;
    const bottom = relativeScrollHeight - relativeScrollTop - portalRect.bottom;
    const right = relativeScrollWidth - relativeScrollLeft - portalRect.right;
    const rect = {
        left,
        top,
        bottom,
        right,
        width : portalRect.width,
        height : portalRect.height
    }
    return rect;
}