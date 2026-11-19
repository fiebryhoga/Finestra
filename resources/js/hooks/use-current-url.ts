import type { InertiaLinkProps } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { toUrl } from '@/lib/utils';

export type IsCurrentUrlFn = (
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    currentUrl?: string,
    startsWith?: boolean,
) => boolean;

export type IsCurrentOrParentUrlFn = (
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    currentUrl?: string,
) => boolean;

export type WhenCurrentUrlFn = <TIfTrue, TIfFalse = null>(
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    ifTrue: TIfTrue,
    ifFalse?: TIfFalse,
    startsWith?: boolean,
) => TIfTrue | TIfFalse;

export type UseCurrentUrlReturn = {
    currentUrl: string;
    isCurrentUrl: IsCurrentUrlFn;
    isCurrentOrParentUrl: IsCurrentOrParentUrlFn;
    whenCurrentUrl: WhenCurrentUrlFn;
};

export function useCurrentUrl(): UseCurrentUrlReturn {
    const page = usePage();
    const currentUrlPath = new URL(
        page.url,
        typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost',
    ).pathname;

    const isCurrentUrl: IsCurrentUrlFn = (
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        currentUrl?: string,
        startsWith: boolean = false,
    ) => {
        const rawUrlToCompare = currentUrl ?? currentUrlPath;
        let urlToCompare = rawUrlToCompare;
        try {
            urlToCompare = new URL(rawUrlToCompare, 'http://localhost')
                .pathname;
        } catch {
            urlToCompare = rawUrlToCompare;
        }

        const urlString = toUrl(urlToCheck);

        let targetPath = urlString;
        try {
            targetPath = new URL(urlString, 'http://localhost').pathname;
        } catch {
            targetPath = urlString;
        }

        const comparePath = (path: string): boolean => {
            const cleanPath =
                path.length > 1 && path.endsWith('/')
                    ? path.slice(0, -1)
                    : path;
            const cleanCompare =
                urlToCompare.length > 1 && urlToCompare.endsWith('/')
                    ? urlToCompare.slice(0, -1)
                    : urlToCompare;

            if (!startsWith || cleanPath === '/') {
                return cleanCompare === cleanPath;
            }

            return (
                cleanCompare === cleanPath ||
                cleanCompare.startsWith(`${cleanPath}/`)
            );
        };

        return comparePath(targetPath);
    };

    const isCurrentOrParentUrl: IsCurrentOrParentUrlFn = (
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        currentUrl?: string,
    ) => {
        return isCurrentUrl(urlToCheck, currentUrl, true);
    };

    const whenCurrentUrl: WhenCurrentUrlFn = <TIfTrue, TIfFalse = null>(
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        ifTrue: TIfTrue,
        ifFalse: TIfFalse = null as TIfFalse,
        startsWith: boolean = false,
    ): TIfTrue | TIfFalse => {
        return isCurrentUrl(urlToCheck, undefined, startsWith)
            ? ifTrue
            : ifFalse;
    };

    return {
        currentUrl: currentUrlPath,
        isCurrentUrl,
        isCurrentOrParentUrl,
        whenCurrentUrl,
    };
}
