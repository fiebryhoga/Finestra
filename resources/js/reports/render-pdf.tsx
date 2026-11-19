import fs from 'node:fs';
import { renderToFile } from '@react-pdf/renderer';
import { QuickRecoveryPdfDocument } from './quick-recovery-pdf';
import { RpeWeeklyPdfDocument } from './rpe-weekly-pdf';
import type { QuickRecoveryReportData, RpeWeeklyReportData } from './types';

function parseArgs(): { type: string; input: string; output: string } {
    const args = process.argv.slice(2);
    let type = '';
    let input = '';
    let output = '';

    for (const arg of args) {
        if (arg.startsWith('--type=')) {
            type = arg.substring('--type='.length);
        } else if (arg.startsWith('--input=')) {
            input = arg.substring('--input='.length);
        } else if (arg.startsWith('--output=')) {
            output = arg.substring('--output='.length);
        }
    }

    if (!type || !input || !output) {
        console.error(
            'Usage: tsx render-pdf.tsx --type=<quick-recovery|rpe-weekly> --input=<path> --output=<path>',
        );
        process.exit(1);
    }

    return { type, input, output };
}

async function main() {
    const { type, input, output } = parseArgs();

    if (!fs.existsSync(input)) {
        console.error(`Input file does not exist: ${input}`);
        process.exit(1);
    }

    const rawJson = fs.readFileSync(input, 'utf-8');
    const data = JSON.parse(rawJson);

    if (type === 'quick-recovery') {
        await renderToFile(
            <QuickRecoveryPdfDocument data={data as QuickRecoveryReportData} />,
            output,
        );
    } else if (type === 'rpe-weekly') {
        await renderToFile(
            <RpeWeeklyPdfDocument data={data as RpeWeeklyReportData} />,
            output,
        );
    } else {
        console.error(`Unknown report type: ${type}`);
        process.exit(1);
    }

    console.log(`[Phynestra React Renderer] Successfully generated: ${output}`);
}

main().catch((err) => {
    console.error('[Phynestra React Renderer] Error:', err);
    process.exit(1);
});
