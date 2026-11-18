import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('size-9 rounded-md', className)}
                    aria-label="Ganti tema tampilan"
                >
                    <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Ganti tema tampilan</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
                <DropdownMenuItem
                    onClick={() => updateAppearance('light')}
                    className={cn(appearance === 'light' && 'bg-accent')}
                >
                    <Sun className="mr-2 size-4" />
                    <span>Terang</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateAppearance('dark')}
                    className={cn(appearance === 'dark' && 'bg-accent')}
                >
                    <Moon className="mr-2 size-4" />
                    <span>Gelap</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateAppearance('system')}
                    className={cn(appearance === 'system' && 'bg-accent')}
                >
                    <Monitor className="mr-2 size-4" />
                    <span>Sistem</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
