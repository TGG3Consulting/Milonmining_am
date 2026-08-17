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
        Schema::table('apartments', function (Blueprint $table) {
            $table->float('square_meter');
            $table->smallInteger('rooms');
            $table->enum('old_status', array_column(ApartmentStatusEnum::cases(), 'value'))->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('apartments', function (Blueprint $table) {
            $table->dropColumn('square_meter');
            $table->dropColumn('rooms');
            $table->dropColumn('old_status');
        });
    }
};
