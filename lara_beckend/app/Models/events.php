<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class events extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'event_date',
        'status',
        'result',
    ];


    public function transactionHistories()
    {
        return $this->hasMany(TransactionHistory::class, 'eventId');
    }

}