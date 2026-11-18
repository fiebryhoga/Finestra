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
    const accentId = `phynestra-accent-${id}`;

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
                    y1="33"
                    x2="36"
                    y2="41"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
            </defs>

            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.1 7H29.4C37.1 7 41.4 11.3 40.3 18.1C39.2 24.8 33.7 28.8 26.2 28.8H18.1L16.5 39.6C16.3 40.4 15.6 41 14.8 41H9.1C8.2 41 7.6 40.2 7.8 39.3L12.5 8.4C12.7 7.6 13.3 7 14.1 7ZM20.3 13.8L19.1 22H26.1C29.7 22 31.9 20.4 32.3 17.9C32.7 15.4 31 13.8 27.4 13.8H20.3Z"
                className={
                    inverted
                        ? 'fill-white'
                        : 'fill-primary dark:fill-foreground'
                }
            />

            <path
                d="M22.2 33.4H34.4C35.3 33.4 35.9 34.2 35.7 35L34.9 39.6C34.7 40.4 34 41 33.2 41H21C20.1 41 19.5 40.2 19.7 39.4L20.5 34.8C20.7 34 21.4 33.4 22.2 33.4Z"
                fill={`url(#${accentId})`}
            />
        </svg>
    );
}
