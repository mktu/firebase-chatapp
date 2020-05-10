import { Profile } from '../../../../types/profile';
import { Reactions } from '../../../../types/message';

export const getReactionsAsUserName  = (profiles: Profile[], reactions?: Reactions) => {
    const reactionsBase = reactions || {};
    const keys = Object.keys(reactionsBase);
    return keys.reduce<{ [s: string]: string[] }>((acc, cur) => {
        const profileIds = reactionsBase[cur];
        const profilesNames = profileIds.map(id => {
            const profile = profiles.find(p => p.id === id);
            return profile?.nickname || 'Unknown';
        });
        acc[cur] = profilesNames;
        return acc;
    }, {});
}
export const getDateAsString = (dateAsMillisec: number) => {
    const date = new Date(dateAsMillisec);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}