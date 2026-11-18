import { Link } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="flex items-center gap-2.5 border-t border-sidebar-border/70 px-2 pt-3 pb-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                    <img
                        src="/assets/unesa.webp"
                        alt="Logo Universitas Negeri Surabaya"
                        className="size-6 shrink-0 object-contain"
                    />
                    <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-xs font-medium text-sidebar-foreground">
                            FIKK UNESA
                        </span>
                        <span className="truncate text-[10px] text-muted-foreground">
                            Universitas Negeri Surabaya
                        </span>
                    </div>
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
