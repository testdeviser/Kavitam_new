<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Wallet extends Model
{
    use HasFactory;
    protected $fillable = [
        'uniquecode',
        'user_id',
        'currency',
        'ammount',
    ];

    protected $with = ['user'];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

}