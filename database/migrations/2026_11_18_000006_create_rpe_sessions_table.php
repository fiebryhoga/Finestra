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
        Schema::create('rpe_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('athlete_id')->constrained()->cascadeOnDelete();
            $table->date('session_date');
            $table->string('session_type', 30)->default('training');
            $table->unsignedSmallInteger('duration_minutes');
            $table->unsignedTinyInteger('rpe');
            $table->unsignedInteger('session_load');
            $table->string('notes', 500)->nullable();
            $table->timestamps();

            $table->index(['athlete_id', 'session_date']);
            $table->index('session_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rpe_sessions');
    }
};
