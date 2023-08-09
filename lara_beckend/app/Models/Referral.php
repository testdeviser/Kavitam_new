<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    use HasFactory;

    protected $fillable = [
        'referred_by_userid',
        'referred_to_userid',
        'amount',
        'event_id',
        'commision',
    ];
}