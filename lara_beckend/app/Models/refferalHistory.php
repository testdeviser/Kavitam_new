<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class refferalHistory extends Model
{
    use HasFactory;
    protected $with=['user','receivedBy'];
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receivedBy', 'id');
    }
}
