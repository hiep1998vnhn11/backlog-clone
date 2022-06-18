<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'shop',
        'customer_name',
        'customer_phone',
        'customer_address',
        'note',
        'total_price',
        'shipping_price',
        'cod_price',
        'cod_edit_price',
        'delivered_at',
        'devivering_at',
        'customer_note',
        'user_id',
        'agent_id',
        'agent_share_id',
        'shipper_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function agent()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function agentShare()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function shipper()
    {
        return $this->belongsTo('App\Models\User');
    }
}
