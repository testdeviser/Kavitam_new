<?php

namespace App\Http\Controllers\adminApi;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Wallet;
use Illuminate\Support\Facades\Validator;
use App\Models\TransactionHistory;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function Index()
    {
        $data = Payment::where('status', 0)->orderBy('updated_at', 'desc')->get();
        $approved = Payment::where('status', 1)->orderBy('updated_at', 'desc')->get();
        $rejected = Payment::where('status', 2)->orderBy('updated_at', 'desc')->get();

        if ($data) {
            return response()->json([
                'status' => 200,
                'payments' => $data,
                'approved' => $approved,
                'rejected' => $rejected,
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'No Record Found!!',
            ]);
        }

    }

    public function withdrawals()
    {
        //$data = Withdrawal::where('status', 0)->orderBy('updated_at', 'desc')->get();

        $data = Withdrawal::select('bank_details.bank_name', 'bank_details.bank_holder_name', 'bank_details.ifsc_code', 'bank_details.account_no', 'bank_details.user_name', 'withdrawals.amount', 'withdrawals.id')
            ->join('bank_details', 'withdrawals.userId', '=', 'bank_details.user_id')
            ->where('withdrawals.status', 0)
            ->orderBy('withdrawals.updated_at', 'desc')
            ->get();

        if ($data) {
            return response()->json([
                'status' => 200,
                'withdrawals' => $data,
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'No Record Found!!',
            ]);
        }

    }

    public function withdrawalHistory()
    {
        //$approved = Withdrawal::where('status', 1)->orderBy('updated_at', 'desc')->get();

        $approved = Withdrawal::select('bank_details.bank_name', 'bank_details.bank_holder_name', 'bank_details.ifsc_code', 'bank_details.account_no', 'bank_details.user_name', 'withdrawals.amount', 'withdrawals.id')
            ->join('bank_details', 'withdrawals.userId', '=', 'bank_details.user_id')
            ->where('withdrawals.status', 1)
            ->orderBy('withdrawals.updated_at', 'desc')
            ->get();

        if ($approved) {
            return response()->json([
                'status' => 200,
                'withdrawalHistory' => $approved,
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'No Record Found!!',
            ]);
        }

    }

    public function pendingWithdrawal()
    {
        //$rejected = Withdrawal::where('status', 2)->orderBy('updated_at', 'desc')->get();

        $rejected = Withdrawal::select('bank_details.bank_name', 'bank_details.bank_holder_name', 'bank_details.ifsc_code', 'bank_details.account_no', 'bank_details.user_name', 'withdrawals.amount', 'withdrawals.id')
            ->join('bank_details', 'withdrawals.userId', '=', 'bank_details.user_id')
            ->where('withdrawals.status', 2)
            ->orderBy('withdrawals.updated_at', 'desc')
            ->get();

        if ($rejected) {
            return response()->json([
                'status' => 200,
                'pendingWithdrawal' => $rejected,
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'No Record Found!!',
            ]);
        }

    }


    public function EditData(Request $req, $id)
    {
        $data = Payment::where('id', $id)->first();
        if ($data) {
            return response()->json([
                'status' => 200,
                'payment' => $data,
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Empty!!',
            ]);
        }
    }

    public function update_old(Request $req, $id)
    {
        $validator = Validator::make($req->all(), [
            'status' => 'required',
        ]);
        $currentDate = Carbon::now()->format('Y-m-d');

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'err' => $validator->messages()]);
        } else {
            $data = Payment::find($id);
            $userId = $data->userId;
            if ($data) {
                $data->status = $req->status;
                $res = $data->save();

                $wallet = Wallet::where('user_id', $userId)->first();
                $wallet->ammount += $data->amount;
                $wallet->update();

                $transaction_history = new TransactionHistory();
                $transaction_history->userId = $userId;
                $transaction_history->walletId = $wallet->id;
                $transaction_history->withdrawalId = 0;
                $transaction_history->UpiId = 0;
                $transaction_history->payment_mode = "Add in wallet";
                $transaction_history->eventId = 0;
                $transaction_history->price = $data->amount;
                $transaction_history->status = 'Cr';
                $transaction_history->current_date = $currentDate;
                $transaction_history->save();

                if ($res) {
                    return response()->json([
                        'status' => 200,
                        'message' => 'Payment updated successfully!',
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

    public function update(Request $req, $id)
    {
        $data = Payment::find($id);
        $userId = $data->userId;
        $currentDate = Carbon::now()->format('Y-m-d');
        if ($data) {
            $data->status = $req->status;
            $res = $data->save();
            $wallet = Wallet::where('user_id', $userId)->first();
            if ($data->status == 1) {
                if ($wallet) {
                    // If the wallet exists, update the amount
                    $wallet->ammount += $data->amount;
                    $wallet->update();
                } else {
                    // If the wallet doesn't exist, create a new wallet
                    $wallet = new Wallet();
                    $wallet->user_id = $userId;
                    $wallet->ammount = $data->amount;
                    $wallet->save();
                }

                $userTransHistory = TransactionHistory::where('userId', $data->userId)->where('UpiId', $id)->first();
                $userTransHistory->status = 'Cr';
                $userTransHistory->update();
                // Add transaction history
                // $transaction_history = new TransactionHistory();
                // $transaction_history->userId = $userId;
                // $transaction_history->walletId = $wallet->id;
                // $transaction_history->withdrawalId = 0;
                // $transaction_history->UpiId = 0;
                // $transaction_history->payment_mode = "Add in wallet";
                // $transaction_history->eventId = 0;
                // $transaction_history->price = $data->amount;
                // $transaction_history->status = 'Cr';
                // $transaction_history->current_date = $currentDate;
                // $transaction_history->save();
            }

            $userData = User::where('id', $data->userId)->first();

            if ($res) {
                return response()->json([
                    'status' => 200,
                    'userData' => $userData,
                    'ammount' => $wallet->ammount,
                    'message' => 'Payment updated successfully!',
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

    public function updateWithdrawals(Request $req, $id)
    {
        $data = Withdrawal::find($id);
        if ($data) {
            $status = $req->status;
            $data->status = $status;
            $data->save();

            $wallet = null; // Initialize $wallet variable

            if ($status == 2) {
                $amount = $data->amount;
                $wallet = Wallet::where('user_id', $data->userId)->increment('ammount', $amount);
                $userWallet = Wallet::where('user_id', $data->userId)->first();
            } else if ($status == 1) {
                $userWallet = Wallet::where('user_id', $data->userId)->first();
                $userTransHistory = TransactionHistory::where('userId', $data->userId)->where('withdrawalId', $id)->first();
                $userTransHistory->status = 'Dr';
                $userTransHistory->update();
            } else {

            }

            $userData = User::where('id', $data->userId)->first();

            return response()->json([
                'status' => 200,
                'userData' => $userData,
                'ammount' => $userWallet->ammount,
                'message' => 'Withdrawal status updated successfully',
            ]);
        }

    }

    public function updatependingWithdrawal(Request $req, $id)
    {
        $data = Withdrawal::find($id);
        if ($data) {
            $data->status = $req->status;
            $data->save();

            $amount = $data->amount;
            $wallet = Wallet::where('user_id', $data->userId)->decrement('ammount', $amount);

            $userTransHistory = TransactionHistory::where('userId', $data->userId)->where('withdrawalId', $id)->first();
            $userTransHistory->status = 'Dr';
            $userTransHistory->update();

            return response()->json([
                'status' => 200,
                'message' => 'Withdrawal status updated successfully',
            ]);
        }

    }





}