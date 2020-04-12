export type Props<T> = {
    className?: string,
    suggestion?: {
        rect: {
            left: number,
            bottom: number,
            height: number
        },
        profiles: T[]
    },
    focusSuggestion: boolean,
    onLeaveSuggenstionFocus: () => void,
    handleSelectMention: (profile: T) => void,
    handleSubmitMessage: () => void,
    onSelectEmoji: (emoji: string) => void,
    onCancel?: () => void,
    renderRichEditor: () => React.ReactElement
}