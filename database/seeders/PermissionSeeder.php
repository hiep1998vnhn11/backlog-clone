<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $adminRole = Role::create(['name' => 'admin']);
        $agentRole = Role::create(['name' => 'agent']);
        $shipperRole = Role::create(['name' => 'shipper']);
        $customerRole = Role::create(['name' => 'customer']);

        Permission::create(['name' => 'agent.create']);
        Permission::create(['name' => 'agent.read']);
        Permission::create(['name' => 'agent.update']);
        Permission::create(['name' => 'agent.delete']);
        Permission::create(['name' => 'agent']);
        Permission::create(['name' => 'shipper.create']);
        Permission::create(['name' => 'shipper.read']);
        Permission::create(['name' => 'shipper.update']);
        Permission::create(['name' => 'shipper.delete']);
        Permission::create(['name' => 'shipper']);

        Permission::create(['name' => 'order.create']);
        Permission::create(['name' => 'order.update']);
        Permission::create(['name' => 'order.delete']);
        Permission::create(['name' => 'order.share']);
        Permission::create(['name' => 'order']);

        Permission::create(['name' => 'customer.create']);
        Permission::create(['name' => 'customer.read']);
        Permission::create(['name' => 'customer.update']);
        Permission::create(['name' => 'customer.delete']);
        Permission::create(['name' => 'customer']);

        $adminRole->givePermissionTo(Permission::all());
        $agentRole->givePermissionTo(
            Permission::query()
                ->where('name', 'like', 'shipper.%')
                ->orWhere('name', 'like', 'order.%')
                ->get()
        );
        $shipperRole->givePermissionTo(
            Permission::query()
                ->orWhere('name', 'like', 'order.%')
                ->get()
        );

        $admin = User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'password' => bcrypt('admin'),
            'phone' => '0343742152',
            'address' => 'Hà Nội',
            'status' => 'active',
            'cccd' => '123456789',
            'note' => 'Admin',
        ]);
        $admin->assignRole($adminRole);

        $agent = User::create([
            'name' => 'Agent',
            'username' => 'agent',
            'password' => bcrypt('agent'),
            'phone' => '0343742151',
            'address' => 'Hà Nội',
            'status' => 'active',
            'cccd' => '123456789',
            'note' => 'Agent',
        ]);
        $agent->assignRole($agentRole);

        $shipper = User::create([
            'name' => 'Shipper',
            'username' => 'shipper',
            'password' => bcrypt('shipper'),
            'phone' => '0343742153',
            'address' => 'Hà Nội',
            'status' => 'active',
            'cccd' => '123456789',
            'note' => 'Shipper',
        ]);
        $shipper->assignRole($shipperRole);

        $customer = User::create([
            'name' => 'Customer',
            'username' => 'customer',
            'password' => bcrypt('customer'),
            'phone' => '0343742154',
            'address' => 'Hà Nội',
            'status' => 'active',
            'cccd' => '123456789',
            'note' => 'Customer',
        ]);
        $customer->assignRole($customerRole);
    }
}
