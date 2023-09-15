<?php

namespace App\Http\Controllers\adminApi;

use App\Http\Controllers\Controller;
use App\Models\PriceMultiplyBy;
use App\Models\UpiIdQRCode;
use Illuminate\Http\Request;
use App\Models\events;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AdminEventController extends Controller
{
    public function Index()
    {
        $data = events::all();
        if ($data) {
            return response()->json([
                'status' => 200,
                'events' => $data,
            ]);
        } else {

            return response()->json([
                'status' => 401,
                'message' => 'No Record Found!!',
            ]);
        }

    }

    // for fetching event in front end
    public function Fetch_Event_in_Front()
    {
        $data = events::where('status', 1)->get();
        if ($data) {
            return response()->json([
                'status' => 200,
                'events' => $data,
            ]);
        } else {

            return response()->json([
                'status' => 401,
                'message' => 'No Record Found!!',
            ]);
        }
    }

    public function create(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'date' => 'required',
            //  'time'=>'required',
            'status' => 'required',
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'err' => $validator->messages()]);
        } else {
            $data = new events();
            $data->event_date = $req->date;
            $data->event_date = Carbon::parse($data->event_date)->timezone('Asia/Kolkata');
            $data->status = $req->status;
            $data->name = $req->name;
            $res = $data->save();
            if ($res) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Event created successfully !',
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'Something went wrong !',
                ]);
            }
        }

    }

    public function delete($id)
    {
        $data = events::find($id);
        if ($data) {
            $res = $data->delete();
            if ($res) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Event deleted successfully !!',
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Something went wrong!!',
                ]);
            }
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Data Found',
            ]);
        }

    }

    public function EditData(Request $req, $id)
    {

        $data = events::where('id', $id)->first();
        if ($data) {
            return response()->json([
                'status' => 200,
                'event' => $data,
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Empty!!',
            ]);
        }
    }
    public function update(Request $req, $id)
    {
        $validator = Validator::make($req->all(), [
            'date' => 'required',
            'status' => 'required',
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'err' => $validator->messages()]);
        } else {
            $data = events::find($id);
            if ($data) {
                $data->event_date = $req->date;
                $data->event_date = Carbon::parse($data->event_date)->timezone('Asia/Kolkata');
                $data->status = $req->status;
                $data->name = $req->name;
                $res = $data->save();
                if ($res) {
                    return response()->json([
                        'status' => 200,
                        'message' => 'Event updated successfully!',
                    ]);
                } else {
                    return response()->json([
                        'status' => 401,
                        'message' => 'Something went wrong!',
                    ]);
                }
            } else {
                return response()->json([
                    'status' => 404,
                    'message' => 'Empty!!',
                ]);
            }

        }
    }

    public function fetchPriceMultiplyBy(Request $request)
    {
        $price = PriceMultiplyBy::first();

        return response()->json([
            'status' => 200,
            'price' => $price,
        ]);

    }

    public function PriceMultiplyByUpdate(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'main' => 'required',
            'ander' => 'required',
            'bahar' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'error' => $validator->messages(),
            ]);
        } else {
            $priceMultiplyBy = PriceMultiplyBy::find($id);
            $priceMultiplyBy->main = $request->main;
            $priceMultiplyBy->ander = $request->ander;
            $priceMultiplyBy->bahar = $request->bahar;
            $priceMultiplyBy->update();

            return response()->json([
                'status' => 200,
                'message' => 'Numbers updated Successfully!!',
            ]);

        }
    }

    public function fetchUPIQRcode(Request $request)
    {
        $UPI = UpiIdQRCode::first();

        return response()->json([
            'status' => 200,
            'upi' => $UPI,
        ]);

    }

    public function UpiIdQRUpdate_old(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'upiId' => 'required|string',
            'qrCode' => 'required|string',
            'imageFile' => 'image|mimes:jpeg,png,jpg',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'error' => $validator->messages(),
            ]);
        } else {
            $UpiIdQRCode = UpiIdQRCode::find($id);
            $UpiIdQRCode->upiId = $request->upiId;
            $UpiIdQRCode->qrCode = $request->qrCode;



            //$UpiIdQRCode->save();

            $UpiIdQRCode->update();

            return response()->json([
                'status' => 200,
                'message' => 'UPI Id and QR Code updated Successfully!!',
            ]);

        }

        // $validator = Validator::make($request->all(), [
        //     'upiId' => 'required',
        //     'qrCode' => 'required',
        // ]);

        // if ($validator->fails()) {
        //     return response()->json([
        //         'status' => 401,
        //         'error' => $validator->messages(),
        //     ]);
        // } else {
        //     $UpiIdQRCode = UpiIdQRCode::find($id);
        //     $UpiIdQRCode->upiId = $request->upiId;
        //     $UpiIdQRCode->qrCode = $request->qrCode;
        //     $UpiIdQRCode->update();

        //     return response()->json([
        //         'status' => 200,
        //         'message' => 'UPI Id and QR Code updated Successfully!!',
        //     ]);

        // }
    }



    public function UpiIdQRUpdate(Request $request, $id)
    {
        // $validator = Validator::make($request->all(), [
        //     'upiId' => 'required|string',
        //     'image' => 'image|mimes:jpeg,png,jpg', // Update to 'image' instead of 'imageFile'
        // ]);

        $validator = Validator::make($request->all(), [
            'upiId' => 'required|string',
            'image' => 'image|mimes:jpeg,png,jpg', // Update to 'image' instead of 'imageFile'
        ], [
            'upiId.required' => 'Please enter UPI Id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'error' => $validator->messages(),
            ]);
        } else {
            $UpiIdQRCode = UpiIdQRCode::find($id);
            $UpiIdQRCode->upiId = $request->upiId;

            // Upload and handle image file
            if ($request->hasFile('imageFile')) {
                $image = $request->file('imageFile');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images'), $imageName);

                // Delete the old image if it exists
                if ($UpiIdQRCode->image) {
                    $oldImagePath = public_path($UpiIdQRCode->image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                $UpiIdQRCode->image = 'images/' . $imageName;
            }

            $UpiIdQRCode->update();

            return response()->json([
                'status' => 200,
                'message' => 'UPI Id, QR Code, and Image updated Successfully!!',
            ]);
        }
    }
}