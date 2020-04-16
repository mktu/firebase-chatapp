import { Profile } from '../../../../../types/profile';

export type SuggestionType = {
    profiles: Profile[],
    node?: HTMLElement
}

export type PresenterProps<T> = {
    className?: string,
    suggestion?: {
        node?: HTMLElement,
        profiles: T[]
    },
    focusSuggestion: boolean,
    onCloseSuggestion: ()=> void,
    onLeaveSuggenstionFocus: () => void,
    handleSelectMention: (profile: T) => void,
    handleSubmitMessage: () => void,
    onSelectEmoji: (emoji: string) => void,
    onCancel?: () => void,
    renderRichEditor: () => React.ReactElement
}