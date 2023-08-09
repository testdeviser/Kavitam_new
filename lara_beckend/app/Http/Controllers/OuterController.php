<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\outer;
use Illuminate\Support\Facades\Cache;


class OuterController extends Controller
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
        $data = new outer();
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

    public function ftchOuter(Request $req)
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

        $data = outer::where('userId', $userId)->where('event_id', $eventId)->where('payment_status', 0)->get();
        if ($data) {
            return response()->json([
                'status' => 200,
                'outer' => $data,
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
        $data = outer::where('number', $id)->where('userId', $req->user_id)->where('event_id', $req->event_id);
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