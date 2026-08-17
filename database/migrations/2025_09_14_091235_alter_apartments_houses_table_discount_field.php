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
        Schema::table('apartments', function (Blueprint $table) {
            $table->float('discount')->nullable();
            $table->boolean('for_main')->default(false);
        });
        Schema::table('houses', function (Blueprint $table) {
            $table->float('discount')->nullable();
        });
        Schema::table('building_garages', function (Blueprint $table) {
            $table->float('discount')->nullable();
            $table->float('price')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
