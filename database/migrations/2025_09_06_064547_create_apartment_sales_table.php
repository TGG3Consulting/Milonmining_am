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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('block');
            $table->string('type')->nullable();
            $table->string('status');
            $table->foreignId('request_id')->nullable()->constrained('requests');
            $table->foreignId('resident_id')->nullable()->constrained('residents');
            $table->foreignId('apartment_id')->nullable()->constrained('apartments');
            $table->foreignId('house_id')->nullable()->constrained('houses');
            $table->foreignId('building_garage_id')->nullable()->constrained('building_garages');
            $table->decimal('price', 12)->nullable();
            $table->decimal('garage_price', 12)->nullable();
            $table->decimal('deposit', 12)->nullable();
            $table->integer('repayment_months_quantity')->nullable(); // type === repayment
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
