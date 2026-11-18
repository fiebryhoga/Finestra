<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('athlete_id')->constrained('athletes')->cascadeOnDelete();
            $table->date('record_date');
            $table->string('week')->default('Belum Set Tanggal Mulai');
            $table->unsignedTinyInteger('age')->default(20);
            $table->decimal('rhr', 5, 2)->default(0);
            $table->decimal('spo2', 5, 2)->default(0);
            $table->decimal('weight', 5, 2)->default(0);
            $table->decimal('vj', 5, 2)->default(0);
            $table->decimal('hr_max', 6, 2)->default(0);
            $table->decimal('hr_ratio', 6, 2)->default(0);
            $table->decimal('vo2_max', 6, 2)->default(0);
            $table->decimal('peak_power', 8, 3)->default(0);
            $table->unsignedTinyInteger('quick_recovery_score')->default(0);
            $table->string('recovery_status', 30)->default('KOSONG');
            $table->timestamps();

            $table->unique(['athlete_id', 'record_date']);
            $table->index(['athlete_id', 'recovery_status', 'record_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_metrics');
    }
};
