import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import Typography from '@material-ui/core/Typography';
import { TokenLoader } from '../Loaders';
import Loader from '../LoadingPage';

const Wrapper = styled.div`
    & > div > .permission-blocked{
        display : flex;
        text-align : center;
        color : ${({ theme }) => `${theme.palette.warning.dark}`};
    }
`;

const Notification: React.FC<{
    className?: string,
    onLoadToken: TokenLoader.OnLoadToken,
    onSwitchNotifiable: (e: React.ChangeEvent<HTMLInputElement>) => void,
    notifiable: boolean
}> = ({
    className,
    onLoadToken,
    onSwitchNotifiable,
    notifiable
}) => {
        return (
            <Wrapper className={className}>
                <TokenLoader.PermissionLoader
                    renderDefault={(onPermissoinRequest) => (
                        <Button variant='outlined' onClick={onPermissoinRequest}>
                            <NotificationsIcon />
                            Configure notification
                        </Button>
                    )}
                    notSupported={<div>
                        <Typography className='permission-blocked'>
                            <NotificationsOffIcon />
                            Notification is not supported in this browser.
                        </Typography>
                    </div>}
                    fallback={<div>
                        <Typography className='permission-blocked'>
                            <NotificationsOffIcon />
                            Notification is now blocked.
                        </Typography>
                        <Typography variant='caption'>
                            To enable notification, please check your browser settings.
                        </Typography>
                    </div>}
                >
                    <TokenLoader.TokenLoader
                        loading={<Loader message='Loading current token...' />}
                        fallback={<FormControlLabel
                            label='FAILED GET TOKEN...'
                            control={<Switch checked={false} />} />}
                        onLoadToken={onLoadToken}
                    >
                        <FormControlLabel
                            label='Enable notification'
                            control={<Switch checked={notifiable} onChange={onSwitchNotifiable} />} />
                    </TokenLoader.TokenLoader>
                </TokenLoader.PermissionLoader>
            </Wrapper>
        )
    }

export default Notification;