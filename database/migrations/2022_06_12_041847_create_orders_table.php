<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('shop');
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->string('customer_address')->nullable();
            $table->string('customer_note', 512)->nullable();
            $table->decimal('total_price', 20, 0)->default(0);
            $table->decimal('shipping_price', 20, 0)->default(0);
            $table->decimal('cod_price', 20, 0)->default(0);
            $table->decimal('cod_edit_price', 20, 0)->default(0);
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('devivering_at')->nullable();
            $table->string('note', 512)->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->unsignedBigInteger('agent_share_id')->nullable();
            $table->unsignedBigInteger('shipper_id')->nullable();
            $table->smallInteger('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
