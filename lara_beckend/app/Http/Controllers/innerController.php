<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\inner;
use Illuminate\Support\Facades\Cache;

class innerController extends Controller
{
    public function create(Request $req)
    {
        Cache::flush();
        if (auth('sanctum')->user()) {
            $userId = auth('sanctum')->user()->id;
        } else {
            $userId = 1;
        }
        ;

        $data = new inner();
        $data->userId = $userId;
        $data->number = $req->number;
        $data->price = $req->prize;
        if ($req->eventId) {
            $data->event_id = $req->eventId;
        }
        $res = $data->save();
        if ($res) {
            return response()->json([
                'status' => 200,
                'message' => 'number creteated successfully',
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something went wrong!!',
            ]);
        }


    }


    public function fetchIner(Request $req)
    {
        Cache::flush();

        $userId = $req->userid;
        $eventId = $req->eventid;

        // if (auth('sanctum')->user()) {
        //     $userId = auth('sanctum')->user()->id;
        // } else {
        //     $userId = 1;
        // }
        // ;

        $data = inner::where('userId', $userId)->where('event_id', $eventId)->where('payment_status', 0)->get();
        if ($data) {
            return response()->json([
                'status' => 200,
                'inner' => $data,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Not found!',
            ]);
        }
    }

    public function remove(Request $req, $id)
    {
        $data = inner::where('number', $id)->where('userId', $req->user_id)->where('event_id', $req->event_id);
        if ($data) {
            $data->delete();
            return response()->json([
                'status' => 200,
                'message' => 'Number removed successfully !',
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Somethig went wrong !',
            ]);
        }
    }
}