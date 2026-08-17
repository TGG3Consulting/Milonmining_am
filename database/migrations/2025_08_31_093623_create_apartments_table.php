<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Services\Apartment\Enum\ApartmentStatusEnum;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('apartments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('building_id')->constrained('buildings')->cascadeOnDelete();
            $table->foreignId('block_id')->constrained('blocks')->cascadeOnDelete();
            $table->foreignId('floor_id')->constrained('floors')->cascadeOnDelete();
            $table->string('number');
            $table->enum('status', array_column(ApartmentStatusEnum::cases(), 'value'))->default(ApartmentStatusEnum::PENDING);
            $table->date('reserved_at')->nullable();
            $table->date('sold_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apartments');
    }
};
