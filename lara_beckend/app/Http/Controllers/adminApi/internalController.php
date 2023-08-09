<?php

namespace App\Http\Controllers\adminApi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\inner;

class internalController extends Controller
{
    public function fetch()
    {

        // $eventid = $request->eventid;
        // $mainNumbers = MainNumbers::join('users', 'main_numbers.userId', '=', 'users.id')
        //     ->where('event_id', $eventid)
        //     ->select('main_numbers.*', 'users.name as user_name')
        //     ->get();

        // return response()->json([
        //     'status' => 200,
        //     'mainNumbers' => $mainNumbers,
        // ]);

        $data=inner::All();
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
                'status'=>401,
                'message'=>'Empty!!',
            ]);
        }
    }

    public function delete($id)
    {
        $data=inner::find($id)->first();
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
