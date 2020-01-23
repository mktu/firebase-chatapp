import { CollectionTransfer, DocumentTransfer } from './core';

export type JoinRequest = {
    status : string,
    profileId : string,
    nickName : string,
    date : number,
    id : string
};
export type JoinRequestsTransfer = CollectionTransfer<JoinRequest>;
export type JoinRequestTransfer = DocumentTransfer<JoinRequest>;
