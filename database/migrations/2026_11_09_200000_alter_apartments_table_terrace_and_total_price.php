<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Three fields the Bitrix connector fills in.
     *
     * total_price is the apartment's own price as the CRM states it
     * (Bitrix `opportunity`), which already includes the terrace. Until now the
     * site multiplied square_meter by active_price, which quietly left the
     * terrace out of every price it showed.
     */
    public function up(): void
    {
        Schema::table('apartments', function (Blueprint $table) {
            $table->boolean('has_terrace')->default(false)->after('duplex');
            $table->double('terrace_area')->nullable()->after('has_terrace');
            $table->decimal('total_price', 14, 2)->nullable()->after('active_price');
        });
    }

    public function down(): void
    {
        Schema::table('apartments', function (Blueprint $table) {
            $table->dropColumn(['has_terrace', 'terrace_area', 'total_price']);
        });
    }
};
