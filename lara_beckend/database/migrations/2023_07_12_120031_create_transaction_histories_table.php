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
        Schema::create('transaction_histories', function (Blueprint $table) {
            $table->id();
            $table->integer('userId');
            $table->integer('walletId');
            $table->integer('withdrawalId')->nullable();
            $table->integer('UpiId')->nullable();
            $table->string('payment_mode');
            $table->integer('eventId');
            $table->integer('price')->nullable();
            $table->string('status')->nullable();
            $table->date('current_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_histories');
    }
};