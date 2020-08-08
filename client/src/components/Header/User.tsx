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
    nickName: string,
    onClick:()=>void
}> = ({
    children,
    className,
    imageUrl,
    nickName,
    onClick
}) => (
            <Wrapper className={className}>
                <ButtonBase onClick={onClick}>
                    {imageUrl ? (
                        <CustomAvatar alt='User avatar' src={imageUrl} />
                    ) : (
                            <CustomAvatar>
                                {children}
                            </CustomAvatar>
                        )}
                        {nickName}
                </ButtonBase>
            </Wrapper >);

export default User;