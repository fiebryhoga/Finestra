import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="3"
                y="3"
                width="26"
                height="26"
                rx="7"
                stroke="currentColor"
                strokeWidth="2.25"
            />
            <path
                d="M7.5 17.5H11.5L14 11L17.5 21.5L20 15.5L21.75 17.5H24.5"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
