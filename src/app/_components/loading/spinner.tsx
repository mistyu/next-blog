import { CSSProperties, FC } from 'react';
import classes from './spinner.module.css';

export const Spinner: FC<{ className?: string; style?: CSSProperties }> = ({
    className,
    style,
}) => {
    const wrapperClasses = className ? `tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center ${className}` : 'tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center';
    return (
        <div className={wrapperClasses} style={style ?? {}}>
            <div className={classes.container} />;
        </div>
    );
};