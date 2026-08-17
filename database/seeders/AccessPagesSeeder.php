<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AccessPagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $guard = 'api';

        // 1) Ensure permissions exist (use what your routes expect)
        $perms = [
            'pages.manage',
            'roles.view',
            'roles.manage',          // optional if you’ll have role editing
            'permissions.view',
            'permissions.manage',    // optional if you’ll add permission editing
        ];

        foreach ($perms as $p) {
            Permission::findOrCreate($p, $guard);
        }

        $super = Role::findOrCreate('super-admin', $guard);
        $super->givePermissionTo($perms);

        Page::updateOrCreate(
            ['key' => 'dashboard'],
            [
                'label'       => 'Dashboard',
                'path'        => '/',
                'icon'        => 'Squares2X2Icon',
                'permissions' => null,      // visible to all authed users
                'sort'        => 0,
                'parent_id'   => null,
                'is_active'   => true,
            ]
        );

        $parent = Page::firstOrCreate(
            ['key' => 'role_management'],
            [
                'label' => 'Role Management',
                'path' => '/access',            // grouping path (doesn’t need a route)
                'icon' => 'Cog6ToothIcon',
                'permissions' => ['pages.manage', 'roles.view'],
                'sort' => 50,
                'parent_id' => null,
                'is_active' => true,
            ]
        );

        // Pages (admin)
        Page::updateOrCreate(
            ['key' => 'pages'],
            [
                'label' => 'Pages',
                'path' => '/pages',
                'icon' => 'RectangleGroupIcon',
                'permissions' => ['pages.manage'],
                'sort' => 0,
                'parent_id' => $parent->id,
                'is_active' => true,
            ]
        );

        // Roles
        Page::updateOrCreate(
            ['key' => 'roles'],
            [
                'label' => 'Roles',
                'path' => '/roles',
                'icon' => 'ShieldCheckIcon',
                'permissions' => ['roles.view'],
                'sort' => 1,
                'parent_id' => $parent->id,
                'is_active' => true,
            ]
        );

        // Users
        Page::updateOrCreate(
            ['key' => 'users'],
            [
                'label' => 'Users',
                'path' => '/users',
                'icon' => 'UserGroupIcon',
                'permissions' => ['users.manage'],
                'sort' => 0,
                'parent_id' => $parent->id,
                'is_active' => true,
            ]
        );

        // Buildings
        Page::updateOrCreate(
            ['key' => 'buildings'],
            [
                'label' => 'Buildings',
                'path' => '/buildings',
                'icon' => 'BuildingLibraryIcon',
                'permissions' => ['buildings.manage', 'buildings.view'],
                'sort' => 0,
                'parent_id' => null,
                'is_active' => true,
            ]
        );

        // Apartments
        Page::updateOrCreate(
            ['key' => 'apartments'],
            [
                'label' => 'Apartments',
                'path' => '/apartments',
                'icon' => 'BuildingOfficeIcon',
                'permissions' => ['apartments.manage'],
                'sort' => 0,
                'parent_id' => null,
                'is_active' => true,
            ]
        );

        // Houses
        Page::updateOrCreate(
            ['key' => 'houses'],
            [
                'label' => 'Houses',
                'path' => '/houses',
                'icon' => 'HomeIcon',
                'permissions' => ['houses.manage'],
                'sort' => 0,
                'parent_id' => null,
                'is_active' => true,
            ]
        );

        // Requests
        Page::updateOrCreate(
            ['key' => 'requests'],
            [
                'label' => 'Requests',
                'path' => '/requests',
                'icon' => 'InboxArrowDownIcon',
                'permissions' => ['requests.manage'],
                'sort' => 0,
                'parent_id' => null,
                'is_active' => true,
            ]
        );

        // Sales  → money/cash vibe
        Page::updateOrCreate(
            ['key' => 'sales'],
            [
                'label' => 'Sales',
                'path' => '/sales',
                'icon' => 'BanknotesIcon', // alt: 'CurrencyDollarIcon' or 'ArrowTrendingUpIcon'
                'permissions' => ['sales.manage'],
                'sort' => 0,
                'parent_id' => null,
                'is_active' => true,
            ]
        );

// Residents → people list
        Page::updateOrCreate(
            ['key' => 'residents'],
            [
                'label' => 'Residents',
                'path' => '/residents',
                'icon' => 'UsersIcon', // alt: 'UserGroupIcon' or 'HomeModernIcon'
                'permissions' => ['residents.manage'],
                'sort' => 0,
                'parent_id' => null,
                'is_active' => true,
            ]
        );

        Page::updateOrCreate(
            ['key' => 'call-center'],
            [
                'label' => 'Call center',
                'path' => '/call-center',
                'icon' => 'PhoneIcon', // alt: 'UserGroupIcon' or 'HomeModernIcon'
                'permissions' => ['calls.manage'],
                'sort' => 0,
                'parent_id' => null,
                'is_active' => true,
            ]
        );
    }
}
