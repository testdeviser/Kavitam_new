<?php

namespace App\Http\Controllers\adminApi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MainNumbers;

class mainController extends Controller
{
    public function fetch()
    {
        $data=MainNumbers::All();
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
                'status'=>401,
                'message'=>'Empty!!',
            ]);
        }

    }

    public function delete($id)
    {
       $data=MainNumbers::where('id',$id)->first();
        if($data)
        {
            $res=$data->delete();
            if($res)
            {
            return response()->json([
                'status'=>200,
                'message'=>'Number deleted successfully',
            ]);
            }
            else
            {
                return response()->json([
                    'message'=>'something went wrong',
                ]);
            }
       }
    }
}
