<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\MainNumbers;
use Illuminate\Support\Facades\Cache;


class MainNumbersController extends Controller
{
    public function create(Request $req)
    {

        Cache::flush();

        if (auth('sanctum')->user()) {
            $userId = auth('sanctum')->user()->id;
        } else {
            $userId = 1;
        }
        $num = $req->number;
        $data = new MainNumbers();
        $data->userId = $userId;
        $data->number = $num;
        $data->prize = $req->prize;

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

    public function fetchMain(Request $req)
    {
        Cache::flush();

        $userId = $req->userid;
        $eventId = $req->eventid;

        // if (auth('sanctum')->user()) {
        //     $userId = auth('sanctum')->user()->id;
        // } else {
        //     $userId = 1;
        // }

        // $data = MainNumbers::where('userId', $userId)->where('event_id', $eventId)->where('payment_status', 0)->get();
        $data = MainNumbers::where('userId', $userId)->where('event_id', $eventId)->where('payment_status', 1)->get();


        if ($data) {
            return response()->json([
                'status' => 200,
                'main' => $data,
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
        $data = MainNumbers::where('number', $id)->where('userId', $req->user_id)->where('event_id', $req->event_id);
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