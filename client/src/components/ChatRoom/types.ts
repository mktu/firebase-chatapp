import { SnapshotListenerRegister, Order } from '../Loaders/InfiniteSnapshotLoader';
import { Message } from '../../../../types/message';

// service interfaces
export type MessageListenerRegister = (args: Parameters<SnapshotListenerRegister<Message>>[0] & { roomId: string }) => ReturnType<SnapshotListenerRegister<Message>>;
export type AddReaction = (
    roomId: string,
    messageId: string,
    reactionId: string,
    profileId: string,
) => void;
export type GetMessages = (args: {
    roomId: string,
    limit: number,
    order: Order,
    onAdded: (messages: Message[]) => void,
    onFailed: () => void
}) => void;

export type GetMessage = (args: {
    roomId: string,
    messageId: string,
    onSucceeded: (message: Message) => void,
}) => void

export type EditMessage = (
    roomId: string,
    messageId: string,
    inputMessage: string,
    profileId: string,
    mentions: string[]
) => void;

export type DisableMessage = (
    roomId: string,
    messageId: string,
) => void