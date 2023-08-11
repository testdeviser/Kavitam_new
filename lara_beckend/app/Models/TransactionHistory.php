<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'userId',
        'walletId',
        'withdrawalId',
        'UpiId',
        'payment_mode',
        'eventId',
        'price',
        'status',
    ];

    public function event()
    {
        return $this->belongsTo(events::class, 'id');
    }

}