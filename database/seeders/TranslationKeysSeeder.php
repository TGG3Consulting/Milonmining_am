<?php

namespace Database\Seeders;

use App\Models\TranslationKey;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TranslationKeysSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'table_name' => 'buildings',
                'key' => 'name',
            ],
            [
                'table_name' => 'buildings',
                'key' => 'address',
            ]
        ];


        foreach ($data as $value) {
            if (TranslationKey::query()->where('table_name', $value['table_name'])->where('key', $value['key'])->exists()) {
                continue;
            }
            TranslationKey::query()->create($value);
        }
    }
}
