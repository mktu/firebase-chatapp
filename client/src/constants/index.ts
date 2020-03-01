export const RequestStatus = {
    Requesting : 'requesting',
    Accepted : 'accepted',
    Rejected : 'rejected'
}

export type LoadingStatusType = 'loading' | 'failed' | 'succeeded';

export const LoadingStatus  : {
    Loading : LoadingStatusType,
    Failed : LoadingStatusType,
    Succeeded : LoadingStatusType
} = {
    Loading : 'loading',
    Failed : 'failed',
    Succeeded : 'succeeded'
}

export const MENTION_REGEX = /(^|\s)(@[\w_-]*)/g;
export const MENTION_TRIGGER = '@';