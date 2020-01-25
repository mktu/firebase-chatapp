import React, { useMemo } from 'react';

import Button from '@material-ui/core/Button';
import InfiniteScroll from 'react-infinite-scroll-component';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Profile } from '../../types/profile';
import { MessagesLoader } from '../Loaders';

type Props = {
    className?: string,
    roomId: string,
    profiles: Profile[]
};

const Messages: React.FC<Props> = ({
    className,
    profiles
}: Props) => {
    return useMemo(() =>
        (
            <div className={className} >
                
            </div >
        ), [profiles])
};

export default Messages;