import React from 'react';
import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';

const Wrapper = styled.div`
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`;

const CustomAvatar = styled(Avatar)`
    margin-right : ${({ theme }) => `${theme.spacing(1)}px`};
`;

const User: React.FC<{
    children: React.ReactElement | string,
    className?: string,
    imageUrl?: string,
    onClick: () => void
}> = ({
    children,
    className,
    imageUrl,
    onClick
}) => (
            <Wrapper className={className}>
                <ButtonBase disableRipple onClick={onClick}>
                    {imageUrl ? (
                        <CustomAvatar alt='User avatar' src={imageUrl} />
                    ) : (
                            <CustomAvatar>
                                {children}
                            </CustomAvatar>
                        )}
                </ButtonBase>
            </Wrapper >);

export default User;