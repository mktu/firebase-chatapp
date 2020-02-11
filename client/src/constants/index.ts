export const RequestStatus = {
    Requesting : 'requesting',
    Accepted : 'accepted',
    Rejected : 'rejected'
}

export const LoadingStatus = {
    Loading : 'loading',
    Failed : 'failed',
    Succeeded : 'succeeded'
}

export const MENTION_REGEX = /(^|\s)(@[\w_-]*)/g;
export const MENTION_TRIGGER = '@';