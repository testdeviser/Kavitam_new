<?php

namespace App\Http\Controllers\adminApi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wallet;

class walletController extends Controller
{
    public function index()
    {
        $data = Wallet::where('ammount', '!=', 0)->get();
        if ($data) {
            return response()->json([
                'status' => 200,
                'user' => $data,
            ]);
        } else {
            return response()->json([
                'status' => 200,
                'message' => 'no record found!',
            ]);
        }
    }
}