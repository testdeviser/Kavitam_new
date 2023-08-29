<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\MailController;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
// Route::get('send-mail', [MailController::class, 'index']);

Route::get('/{any}', function () {
    return view('404'); // Create a blade view named '404.blade.php'
})->where('any', '.*');