<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inners', function (Blueprint $table) {
            $table->id();
            $table->integer('userId')->nullable()->default(1);
            $table->integer('number')->nullable();
            $table->integer('price')->nullable();
            $table->integer('event_id')->nullable();
            $table->boolean('payment_status')->default('0');
            $table->date('current_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inners');
    }
};