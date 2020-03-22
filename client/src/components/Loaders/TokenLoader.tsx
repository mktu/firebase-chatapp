import React, { useState, useEffect, useCallback } from 'react';
import { requestPermission, getToken, getSavedToken, getPermission } from '../../services/notification';
import { LoadingStatusType } from '../../constants';
import { Token } from '../../../../types/notification';

export type OnLoadToken = (rawToken:string,token?:Token)=>void;

const TokenLoader: React.FC<{
    children:React.ReactElement,
    loading:React.ReactElement,
    fallback:React.ReactElement,
    onLoadToken:OnLoadToken
}> = ({
    children,
    loading,
    fallback,
    onLoadToken
}) => {
    const [status,setStatus] = useState<LoadingStatusType>('loading');
    useEffect(() => {
        getToken((rawToken) => {
            getSavedToken(rawToken,(token)=>{
                onLoadToken(rawToken,token);
                setStatus('succeeded');
            },()=>{
                onLoadToken(rawToken);
                setStatus('succeeded');
            })
        }, ()=>{
            setStatus('failed');
        });
    }, [onLoadToken]);
    if(status==='loading'){
        return loading;
    }
    if(status==='failed'){
        return fallback;
    }
    return children;
};

const PermissionLoader: React.FC<{
    renderDefault : ( onPermissionRequest : ()=>void )=>React.ReactElement,
    fallback : React.ReactElement,
    children : React.ReactElement
}> = ({
    renderDefault,
    fallback,
    children
}) =>{
    const [permission, setPermission] = useState<NotificationPermission>('default');
    useEffect(()=>{
        setPermission(getPermission());
    },[]);
    const onPermissionRequest = useCallback(()=>{
        requestPermission(()=>{
            setPermission('granted');
        },()=>{
            setPermission('denied');
        })
    },[])

    if(permission==='default'){
        return renderDefault(onPermissionRequest);
    }
    if(permission==='denied'){
        return fallback
    }
    return children;
}

export {
    TokenLoader,
    PermissionLoader,
}