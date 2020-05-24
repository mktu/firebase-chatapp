import { SnapshotListenerRegister, Order } from '../Loaders/InfiniteSnapshotListener';
import { Message } from '../../../../types/message';
import { Profile } from '../../../../types/profile';

// service interfaces
export type MessageListenerRegister = SnapshotListenerRegister<Message>;
export type AddReaction = (
    messageId: string,
    reactionId: string,
    profileId: string,
) => void;
export type GetMessages = (args: {
    limit: number,
    order: Order,
    onAdded: (messages: Message[]) => void,
    onFailed: () => void
}) => void;

export type GetMessageAtEnd = (args: {
    onAdded: (messages: Message) => void,
    onFailed: () => void
}) => void;

export type GetMessage = (args: {
    messageId: string,
    onSucceeded: (message: Message) => void,
}) => void

export type EditMessage = (
    messageId: string,
    inputMessage: string,
    mentions: string[]
) => void;

export type DisableMessage = (
    messageId: string,
) => void

export type MessagesProps = {
    focusMessageId?: string,
    className?: string,
    messageListenerRegister: MessageListenerRegister,
    getLatestMessage: GetMessageAtEnd,
    getOldestMessage:GetMessageAtEnd,
    getMessage: GetMessage,
    addReaction: AddReaction,
    editMessage : EditMessage,
    disableMessage: DisableMessage,
    profiles: Profile[],
    profile: Profile,
}

export type SingleMessageProps = {
    className?:string,
    profiles: Profile[],
    profile: Profile,
    message: Message,
    addReaction: AddReaction,
    editMessage: EditMessage,
    disableMessage: DisableMessage
}

export type SentMessageProps = {
    className?:string,
    profiles: Profile[],
    sender : Profile,
    message: Message,
    editMessage: EditMessage,
    disableMessage: DisableMessage
}

export type ReceivedMessageProps = {
    className?:string,
    profiles: Profile[],
    sender ?: Profile,
    me : Profile,
    message: Message,
    addReaction: AddReaction,
}