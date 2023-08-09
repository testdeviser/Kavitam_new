<?php

namespace App\Http\Controllers\adminApi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Wallet;

class UserController extends Controller
{
    public function index()
    { 
       $user_id=auth('sanctum')->user()->id;
       $data=User::where('id',$user_id)->first();
        if($data)
        {
            return response()->json([
                'status'=>200,
                'user'=>$data,
            ]);     
        }
        else
        {
            return response()->json([
                'status'=>200,
                'message'=>'no record found!',
            ]);  
        }
    }
}
