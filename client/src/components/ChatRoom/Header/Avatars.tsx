import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { Profile } from '../../../../../types/profile';

const MAX_PROFILE_COUNT = 5;

const Wrapper = styled.div`
    display : flex;
    align-items : center;
    justify-content : space-between;
`;

const MenuIconButton = styled(IconButton)`
    margin : 1px;
    padding : 1px;
`;

const CustomAvatar = styled(Avatar)`
    width: ${({ theme }) => `${theme.spacing(3)}px`};
    height: ${({ theme }) => `${theme.spacing(3)}px`};
    font-size : 15px;
`;


type Props = {
    profiles: Profile[]
    className?: string,
    onClick: (user:Profile)=>void
}

function Avatars({
    profiles,
    className,
    onClick,
}: Props) {
    return (
        <Wrapper className={className} >
            {profiles.length > 0 && (
                <React.Fragment >
                    {profiles.slice(0, MAX_PROFILE_COUNT).map(p => (
                        <Tooltip key={p.id} title={p.nickname}>
                            <MenuIconButton onClick={()=>{
                                onClick(p)
                            }}>
                                {p.imageUrl ? (
                                    <CustomAvatar alt={p.nickname} src={p.imageUrl} />
                                ) : (
                                        <CustomAvatar>
                                            {p.nickname[0]}
                                        </CustomAvatar>
                                    )}
                            </MenuIconButton>
                        </Tooltip>
                    ))}
                </React.Fragment>
            )}
        </Wrapper >
    )
};

export default Avatars;