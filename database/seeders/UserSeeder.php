<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'email' => 'admin@admin',
            'password' => bcrypt('admin'),
            'role' => User::ROLE_ADMIN,
            'name' => 'Admin',
        ]);

        User::create([
            'email' => 'manager@manager',
            'password' => bcrypt('manager'),
            'role' => User::ROLE_MANAGER,
            'name' => 'Manager',
        ]);

        User::create([
            'email' => 'member@member',
            'password' => bcrypt('member'),
            'role' => User::ROLE_MEMBER,
            'name' => 'Member',
        ]);
    }
}