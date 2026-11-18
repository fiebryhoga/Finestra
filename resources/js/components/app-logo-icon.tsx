import type { SVGAttributes } from 'react';
import { useId } from 'react';

type AppLogoIconProps = SVGAttributes<SVGElement> & {
    inverted?: boolean;
};

export default function AppLogoIcon({
    inverted = false,
    ...props
}: AppLogoIconProps) {
    const id = useId();
    const accentId = `finestra-accent-${id}`;

    return (
        <svg
            {...props}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id={accentId}
                    x1="20"
                    y1="20"
                    x2="38"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
            </defs>

            <path
                d="M14.5 7H40.5C41.4 7 42 7.8 41.8 8.7L40.3 14.5C40.1 15.2 39.5 15.7 38.7 15.7H21.8L17.4 39.6C17.2 40.4 16.5 41 15.7 41H8.8C7.9 41 7.2 40.2 7.4 39.3L12.8 8.4C13 7.6 13.7 7 14.5 7Z"
                className={
                    inverted
                        ? 'fill-white'
                        : 'fill-primary dark:fill-foreground'
                }
            />

            <path
                d="M23.6 20.5H36.6C37.5 20.5 38.1 21.3 37.9 22.2L36.7 27.6C36.5 28.3 35.9 28.8 35.1 28.8H22.1C21.2 28.8 20.6 28 20.8 27.1L22 21.7C22.2 21 22.8 20.5 23.6 20.5Z"
                fill={`url(#${accentId})`}
            />

            <path
                d="M21.4 33.4H28.8C29.6 33.4 30.2 34.1 30 34.9L29.1 39.6C28.9 40.4 28.3 41 27.5 41H20.1C19.3 41 18.7 40.3 18.9 39.5L19.8 34.8C20 34 20.6 33.4 21.4 33.4Z"
                className={
                    inverted
                        ? 'fill-sky-300/60'
                        : 'fill-sky-500/45 dark:fill-sky-400/50'
                }
            />
        </svg>
    );
}
