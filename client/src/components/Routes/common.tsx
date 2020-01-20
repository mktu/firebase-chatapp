import React from 'react';
import { useLocation, Redirect } from "react-router-dom";

export const RedirectBack: React.FC<{
    defaultPath: string
}> = ({
    defaultPath
}) => {
        const location = useLocation();
        if (location.state) {
            const { from, pathname } = location.state;
            if (from && from.pathname !== pathname) {
                return <Redirect to={{
                    pathname: from.pathname,
                }} />;
            }
        }
        return <Redirect to={{
            pathname: defaultPath,
        }} />;
    }

