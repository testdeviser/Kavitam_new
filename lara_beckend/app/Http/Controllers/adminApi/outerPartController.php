<?php

namespace App\Http\Controllers\adminApi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\outer;

class outerPartController extends Controller
{
    public function fetch()
    {
         $data=outer::All();
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
                 'status'=>401,
                 'message'=>'Empty!!',
             ]);
         }
    }

    public function delete($id)
    {
        $data=outer::find($id)->first();
        if($data)
        {
           $res=$data->delete();
           if($res)
           {
               return response()->json([
                  'status'=>200,
                  'message'=>'Number deleted successfully!!',
               ]);
           }
           else{
            return response()->json([
                'status'=>401,
                'message'=>'Somehing went wrong!!',                
            ]);
           }
          
        }
        else
        {
            return response()->json([
                'status'=>401,
                'message'=>'failed to find record!!',
            ]);

        }
    }
}
