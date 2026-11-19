<?php

declare(strict_types=1);

namespace App\Services\Reports;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

final class ReactPdfRenderer
{
    /**
     * Render a PDF document using the React PDF Renderer runner.
     *
     * @param  'quick-recovery'|'rpe-weekly'  $type
     * @param  array<string, mixed>  $data
     */
    public function render(string $type, array $data): string
    {
        $inputPath = tempnam(sys_get_temp_dir(), 'phynestra_in_').'.json';
        $outputPath = tempnam(sys_get_temp_dir(), 'phynestra_out_').'.pdf';

        $jsonEncoded = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        file_put_contents($inputPath, $jsonEncoded);

        try {
            $tsxBinary = base_path('node_modules/.bin/tsx');
            $scriptPath = base_path('resources/js/reports/render-pdf.tsx');

            $result = Process::path(base_path())
                ->timeout(60)
                ->run([
                    'node',
                    $tsxBinary,
                    $scriptPath,
                    "--type={$type}",
                    "--input={$inputPath}",
                    "--output={$outputPath}",
                ]);

            if (! $result->successful()) {
                Log::error('React PDF rendering failed', [
                    'type' => $type,
                    'exit_code' => $result->exitCode(),
                    'error_output' => $result->errorOutput(),
                    'output' => $result->output(),
                ]);

                throw new RuntimeException('Gagal merender PDF via React Renderer: '.$result->errorOutput());
            }

            if (! file_exists($outputPath) || filesize($outputPath) === 0) {
                throw new RuntimeException('File PDF hasil render React tidak ditemukan atau kosong.');
            }

            $content = file_get_contents($outputPath);

            if ($content === false) {
                throw new RuntimeException('Gagal membaca file PDF yang dihasilkan.');
            }

            return $content;
        } finally {
            if (file_exists($inputPath)) {
                @unlink($inputPath);
            }
            if (file_exists($outputPath)) {
                @unlink($outputPath);
            }
        }
    }

    /**
     * Return an HTTP response that downloads the rendered PDF.
     *
     * @param  'quick-recovery'|'rpe-weekly'  $type
     * @param  array<string, mixed>  $data
     */
    public function downloadResponse(string $type, array $data, string $filename): Response
    {
        $pdfContent = $this->render($type, $data);

        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Cache-Control' => 'private, no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
