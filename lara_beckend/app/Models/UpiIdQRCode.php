<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UpiIdQRCode extends Model
{
    use HasFactory;
    protected $fillable = [
        'upiId',
        'image',
    ];
}