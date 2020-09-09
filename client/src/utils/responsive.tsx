import React from 'react';
import Responsive from 'react-responsive';

export const DesktopSize = ({...props}) => <Responsive {...props} minWidth={992} />;
export const TabletSize = ({...props}) => <Responsive {...props} minWidth={768} maxWidth={991} />;
export const MobileSize = ({...props}) => <Responsive {...props} maxWidth={767} />;
export const DefaultSize = ({...props}) => <Responsive {...props} minWidth={768} />;