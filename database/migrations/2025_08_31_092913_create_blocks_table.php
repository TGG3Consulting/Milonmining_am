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
        Schema::dropIfExists('blocks');

        Schema::create('blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('building_id')->constrained('buildings');
            $table->string('name'); // 7/1 or 6 (nothing for translation)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blocks');
    }
};
