<?php

namespace App\Services\Account;

use App\Services\Account\Data\MeData;
use Illuminate\Http\Request;
use App\Models\User;
class AccountService
{
    public function me(Request $request): MeData
    {
        /** @var User $user */
        $user = $request->user()->load('roles:id,name');

        $roles     = $user->getRoleNames()->values()->all();
        $abilities = $user->getAllPermissions()->pluck('name')->all();

        return MeData::from([
            'id'             => $user->id,
            'name'           => $user->name,
            'email'          => $user->email,
            'roles'          => $roles,
            'abilities'      => $abilities,
            'is_super_admin' => $user->hasRole('super-admin'),
        ]);
    }
}
