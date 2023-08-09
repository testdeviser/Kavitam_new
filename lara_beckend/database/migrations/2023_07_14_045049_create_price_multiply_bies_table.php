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
        Schema::create('price_multiply_bies', function (Blueprint $table) {
            $table->id();
            $table->integer('main')->nullable();
            $table->integer('ander')->nullable();
            $table->integer('bahar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_multiply_bies');
    }
};