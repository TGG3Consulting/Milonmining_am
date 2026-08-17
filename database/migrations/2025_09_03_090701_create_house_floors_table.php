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
        Schema::create('house_floors', function (Blueprint $table) {
            $table->id();
            $table->smallInteger('level');
            $table->foreignId('house_id')->constrained('houses');
            $table->float('square_meter');
            $table->string('model_image');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('house_floors');
    }
};
