import { CollectionTransfer, DocumentTransfer } from './core';

export const RequestStatus = {
    Requesting : 'requesting',
    Accepted : 'accepted',
    Rejected : 'rejected'
}

export type JoinRequest = {
    status : string,
    profileId : string,
    nickName : string,
    date : number,
    id : string
};
export type JoinRequestsTransfer = CollectionTransfer<JoinRequest>;
export type JoinRequestTransfer = DocumentTransfer<JoinRequest>;
