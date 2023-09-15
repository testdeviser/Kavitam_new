<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BankDetails;
use App\Models\Wallet;
use App\Models\TransactionHistory;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use GuzzleHttp\Client;

class BankController extends Controller
{
    public function index(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'bank_holder_name' => 'required|string',
        //     'account_no' => 'required|numeric|digits_between:11,14',
        //     'confirm_account_no' => 'required|same:account_no',
        //     //'ifsc_code' => 'required',
        //     'ifsc_code' => 'required|regex:/^[a-zA-Z0-9]{11}$/',
        // ]);

        $validator = Validator::make($request->all(), [
            'bank_holder_name' => 'required|string',
            'bank_name' => 'required|string',
            'account_no' => 'required|numeric|digits_between:11,14',
            'confirm_account_no' => 'required|same:account_no',
            //'ifsc_code' => 'required',
            'ifsc_code' => 'required|regex:/^[a-zA-Z0-9]{11}$/',
        ], [
            'bank_holder_name.required' => 'Please enter name',
            'bank_holder_name.string' => 'Bank Holder Name must be string',
            'bank_name.required' => 'Please enter Bank Name',
            'account_no.required' => 'Please enter Account No.',
            'account_no.numeric' => 'Account No. must be numeric',
            'account_no.digits_between' => 'Account No. must be between 11 and 14 digits',
            'confirm_account_no.required' => 'Please enter Confirm Account No.',
            'confirm_account_no.same' => 'Confirm Account No. must match Account No.',
            'ifsc_code.required' => 'Please enter IFSC Code',
            'ifsc_code.regex' => 'IFSC Code must be 11 alphanumeric characters',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'error' => $validator->messages(),
            ]);
        } else {
            $user = auth('sanctum')->user();
            $userId = $user->id;
            $userName = $user->name;

            $bank_details = BankDetails::create([
                'user_id' => $userId,
                'user_name' => $userName,
                'bank_name' => $request->bank_name,
                'bank_holder_name' => $request->bank_holder_name,
                'account_no' => $request->account_no,
                'ifsc_code' => $request->ifsc_code,
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Bank Added Successfully',
            ]);


        }
    }

    public function editBankAccount(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'bank_holder_name' => 'required|string',
        //     'account_no' => 'required|numeric|digits_between:11,14',
        //     'confirm_account_no' => 'required|same:account_no',
        //     'ifsc_code' => 'required',
        //     //'ifsc_code' => 'required|regex:/^[a-zA-Z0-9]{11}$/',
        // ]);

        $validator = Validator::make($request->all(), [
            'bank_holder_name' => 'required|string',
            'bank_name' => 'required|string',
            'account_no' => 'required|numeric|digits_between:11,14',
            'confirm_account_no' => 'required|same:account_no',
            //'ifsc_code' => 'required',
            'ifsc_code' => 'required|regex:/^[a-zA-Z0-9]{11}$/',
        ], [
            'bank_holder_name.required' => 'Please enter name',
            'bank_holder_name.string' => 'Bank Holder Name must be string',
            'bank_name.required' => 'Please enter Bank Name',
            'account_no.required' => 'Please enter Account No.',
            'account_no.numeric' => 'Account No. must be numeric',
            'account_no.digits_between' => 'Account No. must be between 11 and 14 digits',
            'confirm_account_no.required' => 'Please enter Confirm Account No.',
            'confirm_account_no.same' => 'Confirm Account No. must match Account No.',
            'ifsc_code.required' => 'Please enter IFSC Code',
            'ifsc_code.regex' => 'IFSC Code must be 11 alphanumeric characters',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'error' => $validator->messages(),
            ]);
        } else {
            $userId = $request->user_id;
            $bank_holder_name = $request->bank_holder_name;
            $bank_name = $request->bank_name;
            $account_no = $request->account_no;
            $ifsc_code = $request->ifsc_code;

            $userBankDetails = BankDetails::where('user_id', $userId)->first();
            $userBankDetails->bank_holder_name = $bank_holder_name;
            $userBankDetails->bank_name = $bank_name;
            $userBankDetails->account_no = $account_no;
            $userBankDetails->ifsc_code = $ifsc_code;
            $userBankDetails->update();

            return response()->json([
                'status' => 200,
                'data' => $userBankDetails,
                'message' => 'Bank Details updated Successfully',
            ]);
        }
    }

    public function moneyWithdrawal(Request $request)
    {
        $user = auth('sanctum')->user();
        $userId = $user->id;
        $bankDetails = BankDetails::where('user_id', $userId)->first();
        $currentDate = Carbon::now()->format('Y-m-d');
        $withdrawal_amount = $request->withdrawal_amount;
        $userWallet = Wallet::where('user_id', $userId)->first();
        $userWalletId = $userWallet->id;
        $minusUserWallet = $userWallet->decrement('ammount', $withdrawal_amount);
        $userWalletAmount = Wallet::where('user_id', $userId)->first();

        $withdrawal = new Withdrawal();
        $withdrawal->userId = $userId;
        $withdrawal->username = $user->username;
        $withdrawal->amount = $withdrawal_amount;
        $withdrawal->account_no = $bankDetails->account_no;
        $withdrawal->save();

        $transaction_history = new TransactionHistory();
        $transaction_history->userId = $userId;
        $transaction_history->walletId = $userWalletId;
        $transaction_history->withdrawalId = $withdrawal->id;
        $transaction_history->UpiId = 0;
        $transaction_history->payment_mode = "Withdrawal";
        $transaction_history->eventId = 0;
        $transaction_history->price = $withdrawal_amount;
        $transaction_history->status = 'Dr-Pending';
        $transaction_history->current_date = $currentDate;
        $transaction_history->save();

        return response()->json([
            'status' => 200,
            'ammount' => $userWalletAmount->ammount,
            'message' => 'Money withdrawal get Successful',
        ]);
    }

    public function bankDetails(Request $request)
    {
        $user = auth('sanctum')->user();
        $userId = $user->id;
        $bankDetails = BankDetails::where('user_id', $userId)->get();
        return response()->json([
            'status' => 200,
            'bankDetails' => $bankDetails,
            //'message' => 'Money withdrawal get Successful',
        ]);
    }

    public function fetchBankData(Request $request)
    {
        $user = auth('sanctum')->user();
        $userId = $user->id;
        $bankDetails = BankDetails::where('user_id', $userId)->get();
        return response()->json([
            'status' => 200,
            'bankDetails' => $bankDetails,
            //'message' => 'Money withdrawal get Successful',
        ]);
    }

    public function getCurrentIndianTime(Request $request): JsonResponse
    {
        $apiKey = "KOBW56T368TS"; // Replace with your API key
        $apiUrl = "http://api.timezonedb.com/v2.1/get-time-zone?key=$apiKey&format=json&by=zone&zone=Asia/Kolkata";

        try {
            $client = new Client();
            $response = $client->get($apiUrl);
            $data = json_decode($response->getBody(), true);

            if ($data && isset($data['timestamp'])) {
                $timestamp = $data['timestamp'];
                $indianTime = Carbon::createFromTimestamp($timestamp)->format('h:i A');

                return response()->json([
                    'status' => 200,
                    'current_indian_time' => $indianTime,
                ]);
            } else {
                return response()->json(['error' => 'Failed to fetch Indian time'], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching Indian time'], 500);
        }
    }
}