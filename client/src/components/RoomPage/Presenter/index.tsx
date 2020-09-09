import React from 'react';
import { DefaultSize, MobileSize } from '../../../utils/responsive';
import Default, { Props as DefaultProps } from './Default';
import Mobile, { Props as MobileProps } from './Mobile';

export default ({ ...props }: DefaultProps & MobileProps) =>
    (
        <React.Fragment>
            <DefaultSize>
                <Default
                    {...props}
                />
            </DefaultSize>
            <MobileSize>
                <Mobile
                    {...props}
                />
            </MobileSize>
        </React.Fragment>
    )
