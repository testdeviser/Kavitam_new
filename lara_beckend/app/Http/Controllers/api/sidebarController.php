<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\inner;
use App\Models\MainNumbers;
use App\Models\outer;
use App\Models\Wallet;
use Illuminate\Support\Facades\Cache;

class sidebarController extends Controller
{
    public function fetchMain()
    {   Cache::flush();
        $userId=0;
        if(auth('sanctum')->user())
        {
            $userId=auth('sanctum')->user()->id;
        }
        else
        {
              $userId=1;
        }

        $data=MainNumbers::where('userId',$userId)->where('payment_status',0)->get();
        if($data)
        {
            return response()->json([
                'status'=>200,
                'main'=>$data,
            ]);
       }
       else
       {
            return response()->json([
                'status'=>404,
                'message'=>'Not found!',
            ]);
       }
    }

    
    public function fetchInner()
    {
        Cache::flush();
         if(auth('sanctum')->user())
       {
           $userId=auth('sanctum')->user()->id;
       }
       else
       {
            $userId=1;
       };

        $data=inner::where('userId', $userId)->where('payment_status',0)->get();
        if($data)
        {
            return response()->json([
                'status'=>200,
                'inner'=>$data,
            ]);
       }
       else
       {
            return response()->json([
                'status'=>404,
                'message'=>'Not found!',
            ]); 
       }
    }


    public function fetchOuter()
    {
        Cache::flush();
         if(auth('sanctum')->user())
       {
           $userId=auth('sanctum')->user()->id;
       }
       else
       {
            $userId=1;
       };

        $data=outer::where('userId', $userId)->where('payment_status',0)->get();
        if($data)
        {
            return response()->json([
                'status'=>200,
                'outer'=>$data,
            ]);
       }
       else
       {
            return response()->json([
                'status'=>404,
                'message'=>'Not found!',
            ]); 
       }
    }

}
