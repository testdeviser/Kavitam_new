<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\events;

class outer extends Model
{
    use HasFactory;
    protected $with=['user','event'];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId', 'id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(events::class,'event_id', 'id');
    }
}
