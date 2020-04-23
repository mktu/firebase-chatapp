import { SnapshotListenerRegister, Order } from '../Loaders/InfiniteSnapshotLoader';
import { Message } from '../../../../types/message';

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