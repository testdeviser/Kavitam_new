<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\MOdels\events;

class paymentHistory extends Model
{
    use HasFactory;
  
    // protected $with=['user'];
    protected $with=['user','event'];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function event():BelongsTo
    {
        return $this->belongsTo(events::class,'event_id','id');
    }
}
