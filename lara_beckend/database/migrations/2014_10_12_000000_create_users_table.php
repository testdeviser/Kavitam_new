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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('lastname')->nullable();
            $table->string('username')->unique();
            $table->string('email')->unique()->nullable();
            $table->integer('phone');
            $table->timestamp('email_verified_at')->nullable();
            $table->integer('role_as')->default('0');
            $table->string('password');
            $table->string('referredby_user_link');
            $table->string('user_referral_link');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};