<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceMultiplyBy extends Model
{
    use HasFactory;

    protected $fillable = [
        'main',
        'ander',
        'bahar',
    ];
}