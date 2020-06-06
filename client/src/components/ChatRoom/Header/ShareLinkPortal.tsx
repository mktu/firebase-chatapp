import React, {useState} from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Popover from '@material-ui/core/Popover';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const Wrapper = styled.div`
    width : 300px;
    > .actions{
        display : flex;
        align-items : center;
        padding-left : ${({ theme }) => `${theme.spacing(1)}px`};
    }
    > .title{
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
    }
    > .result{
        display : flex;
        justify-content : flex-end;
        padding : ${({ theme }) => `${theme.spacing(1)}px`};
    }
`;

const InputWrapper = styled.div`
    border-radius : 5px;
    width : 100%;
    background-color : #272C34;
    color : white;
    padding : ${({ theme }) => `${theme.spacing(0.1)}px ${theme.spacing(1)}px`};
`;

const StyledInput = styled(InputBase)`
    color : white;
`;

type Props = {
    className?: string,
    onClose: () => void,
    anchor: HTMLElement | null,
    link: string
};

function ShareLinkPortal({
    className,
    anchor,
    onClose,
    link
}: Props) {
    const [coppied,setCoppied] = useState(false);
    return (
        <Popover
            open={Boolean(anchor)}
            anchorEl={anchor}
            className={className}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Wrapper>
                <div className='title'>
                    <Typography variant='subtitle1'>INVITE FRIENDS</Typography>
                    <Typography variant='body1'>You can invite friends from this link</Typography>
                </div>
                <div className='actions'>
                    <InputWrapper>
                        <StyledInput fullWidth value={link} />
                    </InputWrapper>
                    <Tooltip title='Copy a link'>
                        <IconButton onClick={()=>{
                            if(navigator.clipboard && !coppied){
                                navigator.clipboard.writeText(link);
                                setCoppied(true);
                                setTimeout(() => {
                                    setCoppied(false);
                                }, 5000);
                            }
                        }}><FileCopyIcon /></IconButton>
                    </Tooltip>
                </div>
                <div className='result'>
                        {coppied && (
                            <Typography color='secondary' variant='caption'>COPPIED!</Typography>
                        )}
                </div>
            </Wrapper>
        </Popover >
    );
};

export default ShareLinkPortal;