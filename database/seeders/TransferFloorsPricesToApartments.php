<?php

namespace Database\Seeders;

use App\Models\Apartment;
use App\Models\Floor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransferFloorsPricesToApartments extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Floor::query()->get()->map(function(Floor $floor) {
           Apartment::query()
           ->where('floor_id', $floor->id)
           ->update([
               'active_price' => $floor->price
           ]);
        });
    }
}
