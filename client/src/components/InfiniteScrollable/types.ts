export type ScrollDownType = 'jumpable-to-bottom' | 'automatically-scroll-down' | 'disable';

export type ScrollState = {
    direction: 'newer' | 'none' | 'older',
    snapshot: {
        scrollTop: number,
        scrollHeight: number
    }
}