<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\EventResult;
use App\Models\PriceMultiplyBy;
use App\Models\TransactionHistory;
use App\Models\UpiIdQRCode;
use Illuminate\Http\Request;
use App\Models\Wallet;
use App\Models\inner;
use App\Models\MainNumbers;
use App\Models\outer;
use Illuminate\Support\Facades\Cache;
use PhpParser\Node\Expr\Cast\Object_;
use App\Models\events;
use Illuminate\Support\Facades\Validator;
use App\Models\paymentHistory;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\RefferalCode;
use App\Models\refferalHistory;
use App\Models\Referral;
use \stdClass;
use Carbon\Carbon;

class transactionController extends Controller
{
    public function fetch_user_wallet()
    {
        Cache::flush();
        $user = auth('sanctum')->user();
        if ($user) {
            $data = Wallet::where('user_id', $user->id)->first();
            $ammount = $data->ammount;
            $formattedResult = number_format($ammount, 2, '.', '');
            $data->ammount = $formattedResult;

            if ($data) {
                return response()->json([
                    'status' => 200,
                    'wallet' => $data,
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'something went wronge',
                ]);
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'please login first!'
            ]);
        }

    }

    public function decrease_Ammount(Request $req)
    {
        Cache::flush();
        $timeDifference = $req->timeDifference;
        if ($timeDifference >= '10:00') {
            //echo "<pre>";print_r($req->all());
            $user = auth('sanctum')->user();
            $userId = auth('sanctum')->user()->id;
            $event_id = $req->event_id;
            $grandTotal = $req->grandtotal;
            $mainNumbers = $req->mainNumbers;
            $mainAmount = $req->mainAmount;
            $innerNumbers = $req->innerNumbers;
            $innerAmount = $req->innerAmount;
            $outerNumbers = $req->outerNumbers;
            $outerAmount = $req->outerAmount;
            $currentDate = Carbon::now()->format('Y-m-d');
            //    echo "<pre>";print_r($mainNumbers);

            if ($user) {
                $wallet = Wallet::where('user_id', $userId)->first();
                if ($wallet && $wallet->ammount >= $grandTotal) {
                    $message = '';

                    $userReferredByLink = $user->referredby_user_link;
                    if ($userReferredByLink != '' && $userReferredByLink != null) {

                        $minusWalletAmount = $wallet->decrement('ammount', $grandTotal);

                        $transaction_history = new TransactionHistory();
                        $transaction_history->userId = $user->id;
                        $transaction_history->walletId = $wallet->id;
                        $transaction_history->withdrawalId = 0;
                        $transaction_history->payment_mode = "Game Play";
                        $transaction_history->eventId = $event_id;
                        $transaction_history->price = $grandTotal;
                        $transaction_history->status = 'Dr';
                        $transaction_history->current_date = $currentDate;
                        $transaction_history->save();

                        // // update referred By User wallet 
                        $commission = $grandTotal * 0.30;
                        $userReferredByLink = $user->referredby_user_link;

                        $referredByUser = User::where('user_referral_link', $userReferredByLink)->first();
                        if ($referredByUser) {
                            $referredByUserWalletId = Wallet::where('user_id', $referredByUser->id)->first();
                            if ($referredByUserWalletId) {
                                $referredByuserWallet_update = Wallet::where('user_id', $referredByUser->id)->increment('ammount', $commission);

                                $transaction_history = new TransactionHistory();
                                $transaction_history->userId = $referredByUser->id;
                                $transaction_history->walletId = $referredByUserWalletId->id;
                                $transaction_history->withdrawalId = 0;
                                $transaction_history->payment_mode = "Refferal amount";
                                $transaction_history->eventId = $event_id;
                                $transaction_history->price = $commission;
                                $transaction_history->status = 'Cr';
                                $transaction_history->current_date = $currentDate;
                                $transaction_history->save();

                                $ref_history = new Referral();
                                $ref_history->referred_by_userid = $referredByUser->id;
                                $ref_history->referred_to_userid = $user->username;
                                $ref_history->amount = $grandTotal;
                                $ref_history->event_id = $event_id;
                                $ref_history->commision = $commission;
                                $ref_history->current_date = $currentDate;
                                $ref_history->save();

                                foreach ($mainNumbers as $key => $value) {
                                    $number = $value;
                                    $mainPrice = $mainAmount[$key];

                                    $mainNumSave = new MainNumbers();
                                    $mainNumSave->userId = $userId;
                                    $mainNumSave->number = $number;
                                    $mainNumSave->prize = $mainPrice;
                                    $mainNumSave->payment_status = 1;
                                    $mainNumSave->current_date = $currentDate;

                                    if ($event_id) {
                                        $mainNumSave->event_id = $event_id;
                                    }
                                    $mainNumSave->save();
                                }

                                foreach ($innerNumbers as $key => $value) {
                                    $number = $value;
                                    $innerPrice = $innerAmount[$key];

                                    $innerNumSave = new inner();
                                    $innerNumSave->userId = $userId;
                                    $innerNumSave->number = $number;
                                    $innerNumSave->price = $innerPrice;
                                    $innerNumSave->payment_status = 1;
                                    $innerNumSave->current_date = $currentDate;

                                    if ($event_id) {
                                        $innerNumSave->event_id = $event_id;
                                    }
                                    $innerNumSave->save();
                                }

                                foreach ($outerNumbers as $key => $value) {
                                    $number = $value;
                                    $outerPrice = $outerAmount[$key];

                                    $outerNumSave = new outer();
                                    $outerNumSave->userId = $userId;
                                    $outerNumSave->number = $number;
                                    $outerNumSave->price = $outerPrice;
                                    $outerNumSave->payment_status = 1;
                                    $outerNumSave->current_date = $currentDate;

                                    if ($event_id) {
                                        $outerNumSave->event_id = $event_id;
                                    }
                                    $outerNumSave->save();
                                }

                                return response()->json([
                                    'status' => 200,
                                    'payment' => 1,
                                    'message' => 'Payment done successfully',
                                ]);
                            } else {
                                $referredByUserWallet = new Wallet();
                                $referredByUserWallet->user_id = $referredByUser->id;
                                $referredByUserWallet->currency = 'Rupees';
                                $referredByUserWallet->ammount = $commission;
                                $referredByUserWallet->save();

                                $ref_history = new Referral();
                                $ref_history->referred_by_userid = $referredByUser->id;
                                $ref_history->referred_to_userid = $user->username;
                                $ref_history->amount = $grandTotal;
                                $ref_history->event_id = $event_id;
                                $ref_history->commision = $commission;
                                $ref_history->current_date = $currentDate;
                                $ref_history->save();
                            }
                        }
                        //$message = 'congratulations you got 2% discount !!';
                    } else {
                        $minusWalletAmount = $wallet->decrement('ammount', $grandTotal);

                        $wallet = Wallet::where('user_id', $userId)->first();

                        $transaction_history = new TransactionHistory();
                        $transaction_history->userId = $user->id;
                        $transaction_history->walletId = $wallet->id;
                        $transaction_history->withdrawalId = 0;
                        $transaction_history->payment_mode = "Game Play";
                        $transaction_history->eventId = $event_id;
                        $transaction_history->price = $grandTotal;
                        $transaction_history->status = 'Dr';
                        $transaction_history->current_date = $currentDate;
                        $transaction_history->save();


                        foreach ($mainNumbers as $key => $value) {
                            $number = $value;
                            $mainPrice = $mainAmount[$key];

                            $mainNumSave = new MainNumbers();
                            $mainNumSave->userId = $userId;
                            $mainNumSave->number = $number;
                            $mainNumSave->prize = $mainPrice;
                            $mainNumSave->payment_status = 1;
                            $mainNumSave->current_date = $currentDate;

                            if ($event_id) {
                                $mainNumSave->event_id = $event_id;
                            }
                            $mainNumSave->save();
                        }

                        foreach ($innerNumbers as $key => $value) {
                            $number = $value;
                            $innerPrice = $innerAmount[$key];

                            $innerNumSave = new inner();
                            $innerNumSave->userId = $userId;
                            $innerNumSave->number = $number;
                            $innerNumSave->price = $innerPrice;
                            $innerNumSave->payment_status = 1;
                            $innerNumSave->current_date = $currentDate;

                            if ($event_id) {
                                $innerNumSave->event_id = $event_id;
                            }
                            $innerNumSave->save();
                        }

                        foreach ($outerNumbers as $key => $value) {
                            $number = $value;
                            $outerPrice = $outerAmount[$key];

                            $outerNumSave = new outer();
                            $outerNumSave->userId = $userId;
                            $outerNumSave->number = $number;
                            $outerNumSave->price = $outerPrice;
                            $outerNumSave->payment_status = 1;
                            $outerNumSave->current_date = $currentDate;

                            if ($event_id) {
                                $outerNumSave->event_id = $event_id;
                            }
                            $outerNumSave->save();
                        }
                        return response()->json([
                            'status' => 200,
                            'payment' => 1,
                            'message' => 'Payment done successfully',
                        ]);
                    }
                } else {
                    return response()->json([
                        'status' => 403,
                        'message' => 'Not enough balance!!! Please Add money in your wallet',
                    ]);
                }
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'please login first',
                ]);
            }
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Your time is over. You can not pay now. Please wait for the next game to get start',
            ]);
        }
    }

    public function decrease_Ammounvt(Request $req)
    {
        $user = auth('sanctum')->user();

        if ($user) {
            $wallet = Wallet::where('user_id', $user->id)->first();
            if ($wallet->ammount >= $req->ammount) //check balance
            {
                $message = '';
                if ($user->referredBy != null || $user->referredBy != '') {

                    if ($user->discountOnce == 0 || $user->discountOnce == '') {
                        $ammount_after_dis = $req->ammount - ($req->ammount * 2) / 100;
                        $res = $wallet->decrement('ammount', $ammount_after_dis);
                        $data = User::find($user->id);
                        $data->discountOnce = 1;
                        $data->save();

                        // update wallet 
                        $commission = $req->ammount - $ammount_after_dis;

                        $userReferredByLink = $user->referredby_user_link;

                        $referredByUser = User::where('user_referral_link', $userReferredByLink)->first()->toArray();
                        $walletUserid = Wallet::where('user_id', $referredByUser['id'])->first();
                        // echo "<prE>";print_r($walletUserid['ammount']);die;
                        //echo "<prE>";print_r($req->ammount);die;


                        //$refferal_user = User::where('Refer_code', $user->referredBy)->first();
                        $wallet_update = Wallet::where('user_id', $referredByUser['id'])->increment('ammount', $commission);
                        $message = 'congratulations you got 2% discount !!';

                        //  refferal_history
                        $ref_history = new refferalHistory();
                        $ref_history->user_id = $referredByUser['id'];
                        //$ref_history->event_id = $refferal_user->event_id;
                        $ref_history->commission = $commission;
                        $ref_history->status = 'credit';
                        $ref_history->save();
                    } else {
                        $res = $wallet->decrement('ammount', $req->ammount);
                        $message = 'payment successfull!!';
                        //   calculate comminsion
                        $ammount_after_dis = $req->ammount - ($req->ammount * 2) / 100;
                        $commission = $req->ammount - $ammount_after_dis;

                        // $userReferredByLink = $user->referredby_user_link;
                        // if($userReferredByLink != '')
                        // {
                        //     $referredByUser = User::select('id')->where('user_referral_link', $userReferredByLink)->first()->toArray();
                        //     $walletUserid = Wallet::where('user_id', $referredByUser['id'])->first();
                        //     // echo "<prE>";print_r($walletUserid['ammount']);die;
                        //     echo "<prE>";print_r($req->ammount);die;
                        // }

                        // die;
                        // //echo "<prE>";print_r($userReferredByLink);die;
                        $refferal_user = User::where('Refer_code', $user->referredBy)->first();
                        $wallet_update = Wallet::where('user_id', $refferal_user->id)->increment('ammount', $commission);

                        //create refferal_history
                        $ref_history = new refferalHistory();
                        $ref_history->user_id = $refferal_user->id;
                        $ref_history->event_id = $refferal_user->event_id;
                        $ref_history->receivedBy = $user->id;
                        $ref_history->commission = $commission;
                        $ref_history->status = 'credit';
                        $ref_history->save();
                    }

                } else {
                    $res = $wallet->decrement('ammount', $req->ammount);
                    $message = 'payment successfull!!';
                }

                if ($res) {
                    //  update main payment status
                    $main = MainNumbers::where('userId', $user->id)->where('payment_status', 0)->get();
                    if ($main) {
                        foreach ($main as $i) {
                            $updateMain = MainNumbers::find($i->id);
                            $updateMain->payment_status = 1;
                            $updateMain->save();
                        }
                    }
                    //  update inner payment status
                    $inner = inner::where('userId', $user->id)->where('payment_status', 0)->get();
                    if ($inner) {
                        foreach ($inner as $i) {
                            $updateInner = inner::find($i->id);
                            $updateInner->payment_status = 1;
                            $updateInner->save();
                        }
                    }

                    // update outer payment status
                    $outer = outer::where('userId', $user->id)->where('payment_status', 0)->get();
                    if ($outer) {
                        foreach ($outer as $i) {
                            $updateOuter = outer::find($i->id);
                            $updateOuter->payment_status = 1;
                            $updateOuter->save();
                        }
                    }


                    return response()->json([
                        'status' => 200,
                        'message' => $message,
                    ]);
                } else {
                    return response()->json([
                        'status' => 403,
                        'message' => 'Transaction failed',
                    ]);
                }
            } else {
                $addMoneyLink = '<Link href="/add-money">Add money</Link>'; // Add this line

                return response()->json([
                    'status' => 403,
                    'message' => 'Not enough balance!!! Please ' . $addMoneyLink . ' in your wallet',
                ]);
            }


        } else {
            return response()->json([
                'status' => 401,
                'message' => 'please login first',
            ]);

        }

    }

    public function Result(Request $request)
    {
        //echo "Gdghdfhgsfh";
        //$request->event_id = 57;
        $numbers = range(0, 99);
        $existingNumbers = MainNumbers::where('event_id', $request->event_id)->pluck('number')->toArray();
        $nonExistingNumbers = array_diff($numbers, $existingNumbers);
        // echo "<pre>";
        // print_r($nonExistingNumbers);
        $randomNumber = null;
        if (!empty($nonExistingNumbers)) {
            $uniqueRandFirstDigit = [];
            $uniqueRandSecondDigit = [];
            $minRandPrice = null;

            // $randomNumber = $nonExistingNumbers[array_rand($nonExistingNumbers)];

            $firstIndex = array_key_first($nonExistingNumbers);
            $randomNum = $nonExistingNumbers[$firstIndex];

            //$randomNum = $nonExistingNumbers[0];
            if ($randomNum < 10) {
                $num_padded = sprintf("%02d", $randomNum);
                $numberkey = (string) $num_padded;
                $randomNumber = $numberkey;
            } else {
                $randomNumber = $nonExistingNumbers[$firstIndex];
            }

            // $randomNumber1 = str_split($numberkey);
            // $randfrsstDigit = $randomNumber1[0];
            // $randscndDigit = $randomNumber1[1];

            // echo "<prE>";
            // print_r($randfrsstDigit);
            // die;

        } else {
            //selecting the "number" column from the "MainNumbers" table
            $results = MainNumbers::select('number')
                ->where('event_id', $request->event_id)
                // ->selectRaw('SUM(price) as total_price')
                ->groupBy('number')
                ->get();

            //select all the numbers from the $results array
            $numbers = $results->pluck('number')->toArray();

            $uniqueFirstDigit = [];
            $uniqueSecondDigit = [];
            $minPrice = null;

            foreach ($numbers as $key => $value) {
                $number = $value;
                $prices2 = [];

                //selecting the number and sum of price column as total_price on the basis of number
                $mainPrice = MainNumbers::select('number')
                    ->where('event_id', $request->event_id)
                    ->where('number', $number)
                    ->selectRaw('SUM(prize) as total_price')
                    ->groupBy('number')
                    ->get()
                    ->toArray();


                //getting the number from the $mainPrice array
                $numberkey = $mainPrice[0]['number'];
                //getting the total_price from the $mainPrice array
                $pricevalue = $mainPrice[0]['total_price'];
                //converting the one digit number to two digits by adding 0 on the left side of the number
                if ($numberkey < 10) {
                    $num_padded = sprintf("%02d", $numberkey);
                    $numberkey = (string) $num_padded;
                }

                //splitting two digit numbers to check number from the inners and outers table
                $digits1 = str_split($numberkey);
                $frsstDigit = $digits1[0];
                $scndDigit = $digits1[1];

                //pushing the number to the empty array and making it unique
                array_push($uniqueFirstDigit, $frsstDigit);
                $uniqueFirstDigit = array_unique($uniqueFirstDigit);
                array_push($uniqueSecondDigit, $scndDigit);
                $uniqueSecondDigit = array_unique($uniqueSecondDigit);

                //checking the $uniqueFirstDigit numbers in the inner table and sum the values of the price 
                $prices = [];
                foreach ($uniqueFirstDigit as $number) {

                    $priceSum = Inner::where('event_id', $request->event_id)
                        ->where('number', $number)
                        ->sum('price');

                    $prices[$number] = $priceSum;
                }

                //check if $frsstDigit exists in the $prices array, sum the price value from the main table with the inner table
                if (array_key_exists($frsstDigit, $prices)) {
                    $firstItem = $prices[$frsstDigit];
                    $mainInnePRice = $pricevalue + $firstItem;
                }

                //checking the $uniqueSecondDigit numbers in the outer table and sum the values of the price

                $prices1 = [];
                foreach ($uniqueSecondDigit as $number1) {
                    $priceSum1 = Outer::where('event_id', $request->event_id)
                        ->where('number', $number1)
                        ->sum('price');

                    $prices1[$number1] = $priceSum1;
                }

                //check if $scndDigit exists in the $prices1 array, sum the $mainInnePRice value (main + innner) with the outer table
                if (array_key_exists($scndDigit, $prices1)) {
                    $firstItem1 = $prices1[$scndDigit];
                    $mainInnerOuterPrice[$numberkey] = $mainInnePRice + $firstItem1;
                }
            }

            asort($mainInnerOuterPrice);
            //echo "<pre>";print_r($mainInnerOuterPrice);die;

            $min_value = min($mainInnerOuterPrice);
            $min_indices = array_keys($mainInnerOuterPrice, $min_value);
            if (!empty($min_indices)) {
                $randomNumber = $min_indices[array_rand($min_indices)];
            }

            // // TO CONVERT IN OBJECT
            // $totalMIO = [];
            // foreach ($mainInnerOuterPrice as $key => $value) {
            //     $object = new stdClass();
            //     $object->id = $key;
            //     $object->price = $value;
            //     array_push($totalMIO, $object);
            // }
        }
        return response()->json([
            'status' => 200,
            'randomNumber' => $randomNumber,
            //'Ftotal' => $totalMIO,
        ]);
    }

    // public function Result(Request $request)
    // {
    //     $numbers = range(1, 99);
    //     $existingNumbers = MainNumbers::where('event_id', $request->event_id)->pluck('number')->toArray();
    //     $nonExistingNumbers = array_diff($numbers, $existingNumbers);
    //     $randomNumber = null;
    //     if (!empty($nonExistingNumbers)) {

    //         $randomNumber = $nonExistingNumbers[array_rand($nonExistingNumbers)];

    //         //selecting the "number" column from the "MainNumbers" table
    //         $results = MainNumbers::select('number')
    //             ->where('event_id', $request->event_id)
    //             // ->selectRaw('SUM(price) as total_price')
    //             ->groupBy('number')
    //             ->get();

    //         //select all the numbers from the $results array
    //         $numbers = $results->pluck('number')->toArray();

    //         $uniqueFirstDigit = [];
    //         $uniqueSecondDigit = [];
    //         $minPrice = null;

    //         foreach ($numbers as $key => $value) {
    //             $number = $value;
    //             $prices2 = [];

    //             //selecting the number and sum of price column as total_price on the basis of number
    //             $mainPrice = MainNumbers::select('number')
    //                 ->where('event_id', $request->event_id)
    //                 ->where('number', $number)
    //                 ->selectRaw('SUM(prize) as total_price')
    //                 ->groupBy('number')
    //                 ->get()
    //                 ->toArray();


    //             //getting the number from the $mainPrice array
    //             $numberkey = $mainPrice[0]['number'];
    //             //getting the total_price from the $mainPrice array
    //             $pricevalue = $mainPrice[0]['total_price'];
    //             //converting the one digit number to two digits by adding 0 on the left side of the number
    //             if ($numberkey < 10) {
    //                 $num_padded = sprintf("%02d", $numberkey);
    //                 $numberkey = (string) $num_padded;
    //             }

    //             //splitting two digit numbers to check number from the inners and outers table
    //             $digits1 = str_split($numberkey);
    //             $frsstDigit = $digits1[0];
    //             $scndDigit = $digits1[1];

    //             //pushing the number to the empty array and making it unique
    //             array_push($uniqueFirstDigit, $frsstDigit);
    //             $uniqueFirstDigit = array_unique($uniqueFirstDigit);
    //             array_push($uniqueSecondDigit, $scndDigit);
    //             $uniqueSecondDigit = array_unique($uniqueSecondDigit);

    //             //checking the $uniqueFirstDigit numbers in the inner table and sum the values of the price 
    //             $prices = [];
    //             foreach ($uniqueFirstDigit as $number) {

    //                 $priceSum = Inner::where('event_id', $request->event_id)
    //                     ->where('number', $number)
    //                     ->sum('price');

    //                 $prices[$number] = $priceSum;
    //             }

    //             //check if $frsstDigit exists in the $prices array, sum the price value from the main table with the inner table
    //             if (array_key_exists($frsstDigit, $prices)) {
    //                 $firstItem = $prices[$frsstDigit];
    //                 $mainInnePRice = $pricevalue + $firstItem;
    //             }

    //             //checking the $uniqueSecondDigit numbers in the outer table and sum the values of the price

    //             $prices1 = [];
    //             foreach ($uniqueSecondDigit as $number1) {
    //                 $priceSum1 = Outer::where('event_id', $request->event_id)
    //                     ->where('number', $number1)
    //                     ->sum('price');

    //                 $prices1[$number1] = $priceSum1;
    //             }

    //             //check if $scndDigit exists in the $prices1 array, sum the $mainInnePRice value (main + innner) with the outer table
    //             if (array_key_exists($scndDigit, $prices1)) {
    //                 $firstItem1 = $prices1[$scndDigit];
    //                 $mainInnerOuterPrice[$numberkey] = $mainInnePRice + $firstItem1;
    //             }
    //         }


    //         asort($mainInnerOuterPrice);

    //         $totalMIO = [];
    //         foreach ($mainInnerOuterPrice as $key => $value) {
    //             $object = new stdClass();
    //             $object->id = $key;
    //             $object->price = $value;
    //             array_push($totalMIO, $object);
    //         }

    //         return response()->json([
    //             'status' => 200,
    //             'randomNumber' => $randomNumber,
    //             'total' => $totalMIO,
    //         ]);

    //     } else {

    //         //selecting the "number" column from the "MainNumbers" table
    //         $results = MainNumbers::select('number')
    //             ->where('event_id', $request->event_id)
    //             // ->selectRaw('SUM(price) as total_price')
    //             ->groupBy('number')
    //             ->get();

    //         //select all the numbers from the $results array
    //         $numbers = $results->pluck('number')->toArray();

    //         $uniqueFirstDigit = [];
    //         $uniqueSecondDigit = [];
    //         $minPrice = null;

    //         foreach ($numbers as $key => $value) {
    //             $number = $value;
    //             $prices2 = [];

    //             //selecting the number and sum of price column as total_price on the basis of number
    //             $mainPrice = MainNumbers::select('number')
    //                 ->where('event_id', $request->event_id)
    //                 ->where('number', $number)
    //                 ->selectRaw('SUM(prize) as total_price')
    //                 ->groupBy('number')
    //                 ->get()
    //                 ->toArray();


    //             //getting the number from the $mainPrice array
    //             $numberkey = $mainPrice[0]['number'];
    //             //getting the total_price from the $mainPrice array
    //             $pricevalue = $mainPrice[0]['total_price'];
    //             //converting the one digit number to two digits by adding 0 on the left side of the number
    //             if ($numberkey < 10) {
    //                 $num_padded = sprintf("%02d", $numberkey);
    //                 $numberkey = (string) $num_padded;
    //             }

    //             //splitting two digit numbers to check number from the inners and outers table
    //             $digits1 = str_split($numberkey);
    //             $frsstDigit = $digits1[0];
    //             $scndDigit = $digits1[1];

    //             //pushing the number to the empty array and making it unique
    //             array_push($uniqueFirstDigit, $frsstDigit);
    //             $uniqueFirstDigit = array_unique($uniqueFirstDigit);
    //             array_push($uniqueSecondDigit, $scndDigit);
    //             $uniqueSecondDigit = array_unique($uniqueSecondDigit);

    //             //checking the $uniqueFirstDigit numbers in the inner table and sum the values of the price 
    //             $prices = [];
    //             foreach ($uniqueFirstDigit as $number) {

    //                 $priceSum = Inner::where('event_id', $request->event_id)
    //                     ->where('number', $number)
    //                     ->sum('price');

    //                 $prices[$number] = $priceSum;
    //             }

    //             //check if $frsstDigit exists in the $prices array, sum the price value from the main table with the inner table
    //             if (array_key_exists($frsstDigit, $prices)) {
    //                 $firstItem = $prices[$frsstDigit];
    //                 $mainInnePRice = $pricevalue + $firstItem;
    //             }

    //             //checking the $uniqueSecondDigit numbers in the outer table and sum the values of the price

    //             $prices1 = [];
    //             foreach ($uniqueSecondDigit as $number1) {
    //                 $priceSum1 = Outer::where('event_id', $request->event_id)
    //                     ->where('number', $number1)
    //                     ->sum('price');

    //                 $prices1[$number1] = $priceSum1;
    //             }

    //             //check if $scndDigit exists in the $prices1 array, sum the $mainInnePRice value (main + innner) with the outer table
    //             if (array_key_exists($scndDigit, $prices1)) {
    //                 $firstItem1 = $prices1[$scndDigit];
    //                 $mainInnerOuterPrice[$numberkey] = $mainInnePRice + $firstItem1;
    //             }
    //         }


    //         asort($mainInnerOuterPrice);
    //         //echo "<pre>";print_r($mainInnerOuterPrice);die;


    //         $min_value = min($mainInnerOuterPrice);
    //         $min_indices = array_keys($mainInnerOuterPrice, $min_value);
    //         if (!empty($min_indices)) {
    //             $randomNumber = $min_indices[array_rand($min_indices)];
    //         }


    //         // TO CONVERT IN OBJECT
    //         $totalMIO = [];
    //         foreach ($mainInnerOuterPrice as $key => $value) {
    //             $object = new stdClass();
    //             $object->id = $key;
    //             $object->price = $value;
    //             array_push($totalMIO, $object);
    //         }

    //         return response()->json([
    //             'status' => 200,
    //             'randomNumber' => $randomNumber,
    //             'total' => $totalMIO,
    //         ]);

    //     }

    // }

    public function Annouce_Result(Request $req)
    {
        $event = $req->event;
        $number = $req->number;
        $eventsTime = $req->eventsTime;
        $currentDate = Carbon::now()->format('Y-m-d');

        // Check if a record with the same event_id and current_date exists in the database
        $existingRecord = EventResult::where('event_id', $event)
            ->where('current_date', $currentDate)
            ->first();

        if ($existingRecord) {
            // If a record exists, update the 'result' column
            $existingRecord->update(['result' => $number]);

            return response()->json([
                'status' => 200,
                'message' => 'Result Updated Successfully!',
            ]);
        } else {
            // If no record exists, create a new one
            $user = EventResult::create([
                'event_id' => $event,
                'event_time' => $eventsTime,
                'current_date' => $currentDate,
                'result' => $number,
            ]);

            if ($user) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Result Announced Successfully!',
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Not Found!',
                ]);
            }
        }



        // $data = events::find($req->id);
        // $data->result = $req->number;
        // $res = $data->save();

        $digits1 = str_split($req->number);
        $frsstDigit = $digits1[0];
        $scndDigit = $digits1[1];

        $priceMultiplyBy = PriceMultiplyBy::first();
        $main = $priceMultiplyBy->main;
        $ander = $priceMultiplyBy->ander;
        $bahar = $priceMultiplyBy->bahar;

        $winning_users_frm_main = MainNumbers::where('number', $req->number)->where('event_id', $req->id)->get();
        if (!empty($winning_users_frm_main)) {
            foreach ($winning_users_frm_main as $key => $value) {
                $userId = $value->userId;
                $userAmount = $value->prize;
                $winningPrice = $userAmount * $main;
                $userWallet = Wallet::where('user_id', $userId)->first();
                $userWalletId = $userWallet->id;
                $priceAddedTowallet = Wallet::where('user_id', $userId)->increment('ammount', $winningPrice);

                $transaction_history = new TransactionHistory();
                $transaction_history->userId = $userId;
                $transaction_history->walletId = $userWalletId;
                $transaction_history->withdrawalId = 0;
                $transaction_history->payment_mode = "Win";
                $transaction_history->eventId = $req->id;
                $transaction_history->price = $winningPrice;
                $transaction_history->status = 'Cr';
                $transaction_history->current_date = $currentDate;
                $transaction_history->save();

            }
        }

        $winning_users_frm_inner = inner::where('number', $frsstDigit)->where('event_id', $req->id)->get();
        if (!empty($winning_users_frm_inner)) {
            foreach ($winning_users_frm_inner as $key => $value1) {
                $userId1 = $value1->userId;
                $userAmount1 = $value1->price;
                $winningPrice1 = $userAmount1 * $ander;
                $userWallet1 = Wallet::where('user_id', $userId1)->first();
                $userWalletId1 = $userWallet1->id;
                $priceAddedTowallet1 = Wallet::where('user_id', $userId1)->increment('ammount', $winningPrice1);

                $transaction_history = new TransactionHistory();
                $transaction_history->userId = $userId1;
                $transaction_history->walletId = $userWalletId1;
                $transaction_history->withdrawalId = 0;
                $transaction_history->payment_mode = "Win";
                $transaction_history->eventId = $req->id;
                $transaction_history->price = $winningPrice1;
                $transaction_history->status = 'Cr';
                $transaction_history->current_date = $currentDate;
                $transaction_history->save();
            }
        }

        $winning_users_frm_outer = outer::where('number', $scndDigit)->where('event_id', $req->id)->get();
        if (!empty($winning_users_frm_outer)) {
            foreach ($winning_users_frm_outer as $key => $value2) {
                $userId2 = $value2->userId;
                $userAmount2 = $value2->price;
                $winningPrice2 = $userAmount2 * $bahar;
                $userWallet2 = Wallet::where('user_id', $userId2)->first();
                $userWalletId2 = $userWallet2->id;
                $priceAddedTowallet2 = Wallet::where('user_id', $userId2)->increment('ammount', $winningPrice2);

                $transaction_history = new TransactionHistory();
                $transaction_history->userId = $userId2;
                $transaction_history->walletId = $userWalletId2;
                $transaction_history->withdrawalId = 0;
                $transaction_history->payment_mode = "Win";
                $transaction_history->eventId = $req->id;
                $transaction_history->price = $winningPrice2;
                $transaction_history->status = 'Cr';
                $transaction_history->current_date = $currentDate;
                $transaction_history->save();
            }
        }

        if ($user) {
            return response()->json([
                'status' => 200,
                'message' => 'Result Announce Successfully!',
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'not found!',
            ]);
        }

    }

    public function finalResult(Request $req)
    {
        $event = $req->event;
        $number = $req->number;
        $eventsTime = $req->eventsTime;
        $formattedTime = date('H:i:s', strtotime($eventsTime));
        $currentDate = Carbon::now()->format('Y-m-d');

        // Check if a record with the same event_id and current_date exists in the database
        $existingRecord = EventResult::where('event_id', $event)
            ->where('current_date', $currentDate)
            ->first();

        if ($existingRecord) {
            // // If a record exists, update the 'result' column
            // $existingRecord->update(['result' => $number]);

            // return response()->json([
            //     'status' => 200,
            //     'message' => 'Result Updated Successfully!',
            // ]);
        } else {

            // If no record exists, create a new one
            $user = EventResult::create([
                'event_id' => $event,
                'event_time' => $formattedTime,
                'current_date' => $currentDate,
                'result' => $number,
            ]);

            // $testing = [
            //     'event_id' => $event,
            //     'event_time' => $eventsTime,
            //     'current_date' => $currentDate,
            //     'result' => $number,
            //     ];

            // $testingg = json_encode($testing);
            if ($user) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Result Announced Successfully!',
                ]);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Not Found!',
                ]);
            }
        }



        // $data = events::find($req->id);
        // $data->result = $req->number;
        // $res = $data->save();

        $digits1 = str_split($req->number);
        $frsstDigit = $digits1[0];
        $scndDigit = $digits1[1];

        $priceMultiplyBy = PriceMultiplyBy::first();
        $main = $priceMultiplyBy->main;
        $ander = $priceMultiplyBy->ander;
        $bahar = $priceMultiplyBy->bahar;

        $winning_users_frm_main = MainNumbers::where('number', $req->number)->where('event_id', $req->event)->get();
        if (!empty($winning_users_frm_main)) {
            foreach ($winning_users_frm_main as $key => $value) {
                $userId = $value->userId;
                $userAmount = $value->prize;
                $winningPrice = $userAmount * $main;
                $userWallet = Wallet::where('user_id', $userId)->first();
                $userWalletId = $userWallet->id;
                $priceAddedTowallet = Wallet::where('user_id', $userId)->increment('ammount', $winningPrice);

                $transaction_history = new TransactionHistory();
                $transaction_history->userId = $userId;
                $transaction_history->walletId = $userWalletId;
                $transaction_history->withdrawalId = 0;
                $transaction_history->payment_mode = "Win";
                $transaction_history->eventId = $req->event;
                $transaction_history->price = $winningPrice;
                $transaction_history->status = 'Cr';
                $transaction_history->current_date = $currentDate;
                $transaction_history->save();

            }
        }

        $winning_users_frm_inner = inner::where('number', $frsstDigit)->where('event_id', $req->event)->get();
        if (!empty($winning_users_frm_inner)) {
            foreach ($winning_users_frm_inner as $key => $value1) {
                $userId1 = $value1->userId;
                $userAmount1 = $value1->price;
                $winningPrice1 = $userAmount1 * $ander;
                $userWallet1 = Wallet::where('user_id', $userId1)->first();
                $userWalletId1 = $userWallet1->id;
                $priceAddedTowallet1 = Wallet::where('user_id', $userId1)->increment('ammount', $winningPrice1);

                $transaction_history = new TransactionHistory();
                $transaction_history->userId = $userId1;
                $transaction_history->walletId = $userWalletId1;
                $transaction_history->withdrawalId = 0;
                $transaction_history->payment_mode = "Win";
                $transaction_history->eventId = $req->event;
                $transaction_history->price = $winningPrice1;
                $transaction_history->status = 'Cr';
                $transaction_history->current_date = $currentDate;
                $transaction_history->save();
            }
        }

        $winning_users_frm_outer = outer::where('number', $scndDigit)->where('event_id', $req->event)->get();
        if (!empty($winning_users_frm_outer)) {
            foreach ($winning_users_frm_outer as $key => $value2) {
                $userId2 = $value2->userId;
                $userAmount2 = $value2->price;
                $winningPrice2 = $userAmount2 * $bahar;
                $userWallet2 = Wallet::where('user_id', $userId2)->first();
                $userWalletId2 = $userWallet2->id;
                $priceAddedTowallet2 = Wallet::where('user_id', $userId2)->increment('ammount', $winningPrice2);

                $transaction_history = new TransactionHistory();
                $transaction_history->userId = $userId2;
                $transaction_history->walletId = $userWalletId2;
                $transaction_history->withdrawalId = 0;
                $transaction_history->payment_mode = "Win";
                $transaction_history->eventId = $req->event;
                $transaction_history->price = $winningPrice2;
                $transaction_history->status = 'Cr';
                $transaction_history->current_date = $currentDate;
                $transaction_history->save();
            }
        }

        if ($res) {
            return response()->json([
                'status' => 200,
                'message' => 'Result Announce Successfully!',
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'not found!',
            ]);
        }

    }


    public function AlreadyPlay_this_event(Request $req, $event_id)
    {
        $user = auth('sanctum')->user();
        $main = MainNumbers::where('event_id', $event_id)->where('payment_status', 1)->where('userId', $user->id)->first();
        $inner = inner::where('event_id', $event_id)->where('payment_status', 1)->where('userId', $user->id)->first();
        $outer = outer::where('event_id', $event_id)->where('payment_status', 1)->where('userId', $user->id)->first();

        if ($main || $inner || $outer) {
            return response()->json([
                'status' => 401,
                'message' => 'You have already play this event',
            ]);
        } else {
            return response()->json([
                'status' => 200,
            ]);
        }
    }


    public function paymentHistory(Request $req)
    {
        $user = auth('sanctum')->user();
        $validator = Validator::make($req->all(), [
            'event_id' => 'required',
            'price' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->messages(),

            ]);
        } else {
            $data = new paymentHistory();
            $data->event_id = $req->event_id;
            $data->price = $req->price;
            $data->user_id = $user->id;
            $data->status = $req->status;
            $res = $data->save();
            if ($res) {
                return response()->json([
                    'status' => 200,
                    'message' => 'payment history created successfully!!',
                ]);
            } else {

                return response()->json([
                    'status' => 401,
                    'message' => 'Something went wrong!!',
                ]);
            }
        }
    }


    public function fetchpayment_history()
    {
        echo "testing now";
        // $user = auth('sanctum')->user();
        // $data = paymentHistory::where('user_id', $user->id)->get();
        // if ($data) {
        //     return response()->json([
        //         'status' => 200,
        //         'data' => $data,
        //     ]);
        // } else {

        //     return response()->json([
        //         'status' => 400,
        //         'data' => 'no record found!!',
        //     ]);
        // }
    }

    public function RefferalLink(Request $req)
    {
        $user = auth('sanctum')->user();
        $validator = Validator::make($req->all(), [
            'email' => 'required|email',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'error' => $validator->messages(),
            ]);
        } else {
            $email = $req->input('email');
            $mailData = [
                'title' => 'Gampin Point',
                'body' => 'You will get 2% off on first purchase',
                'RefferralCode' => $user->Refer_code,
                'link' => 'http://localhost:3000/register',
            ];

            Mail::to($email)->send(new RefferalCode($mailData));

            return response()->json([
                'status' => 200,
                'message' => 'Refferal code send successfully!',
            ]);
        }


    }

    public function fetchRefferalCode(Request $request)
    {
        // $user = auth('sanctum')->user();
        $userid = $request->userid;
        $user = User::where('id', $userid)->first();
        if ($user) {
            return response()->json([
                'status' => 200,
                'user' => $user,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'RefferralCode' => 'Empty Record found!!',
            ]);
        }
    }

    public function fetchRefferal_code()
    {
        $user = auth('sanctum')->user();
        if ($user) {
            return response()->json([
                'status' => 200,
                'RefferralCode' => $user->Refer_code,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'RefferralCode' => 'Empty Record found!!',
            ]);
        }

    }


    public function fetch_referral_commission()
    {

        $user = auth('sanctum')->user();
        $sumData = Referral::where('referred_by_userid', $user->id)
            ->select('referred_to_userid', \DB::raw('SUM(amount) as total_amount'), \DB::raw('SUM(commision) as total_commision'))
            ->groupBy('referred_to_userid')
            ->get();

        // echo "<pre>";
        // print_r($sumData);


        if ($sumData) {
            return response()->json([
                'status' => 200,
                'payments' => $sumData,
                // 'referred_by_userid' => $sumData->referred_by_userid,
                // 'total_amount' => $sumData->total_amount,
                // 'total_commission' => $sumData->total_commission,
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'No Record Found!!',
            ]);
        }

        //$data = Referral::all();
        // $user = auth('sanctum')->user();
        // $data = Referral::where('referred_by_userid', $user->id)->get();
        // if ($data) {
        //     return response()->json([
        //         'status' => 200,
        //         'payments' => $data,
        //     ]);
        // } else {

        //     return response()->json([
        //         'status' => 401,
        //         'message' => 'No Record Found!!',
        //     ]);
        // }

        //$user = auth('sanctum')->user();


        // $referredUsers = User::where('referredby_user_link', $user->user_referral_link)->get();
        // $userIds = $referredUsers->pluck('id')->toArray();

        // $mainNumbers = MainNumbers::whereIn('userId', $userIds)->where('payment_status', 1)->get();
        // $inners = Inner::whereIn('userId', $userIds)->where('payment_status', 1)->get();
        // $outers = Outer::whereIn('userId', $userIds)->where('payment_status', 1)->get();

        // $totalMainAmount = $mainNumbers->sum('prize');
        // $totalInnerAmount = $inners->sum('price');
        // $totalOuterAmount = $outers->sum('price');

        // $total = $totalMainAmount + $totalInnerAmount + $totalOuterAmount;

        // echo "<pre>";
        // print_r($total);
        // die;
        //$data = refferalHistory::where('user_id', $user->id)->get();
        // if ($referredUsers) {
        //     return response()->json([
        //         'status' => 200,
        //         'data' => $referredUsers,
        //     ]);
        // } else {
        //     return response()->json([
        //         'status' => 200,
        //         'data' => 'Empty!!',
        //     ]);
        // }
    }

    public function fetchWalletBalance()
    {
        $user = auth('sanctum')->user();
        if ($user) {
            $userId = $user->id;
            $userData = Wallet::select('ammount')->where('user_id', $userId)->first();
            if ($userData) {
                $formattedResult = number_format($userData['ammount'], 2, '.', '');
                return response()->json([
                    'status' => 200,
                    'amount' => $formattedResult,
                ]);
            } else {
                return response()->json([
                    'status' => 200,
                    'data' => 'Empty!!',
                ]);
            }
        }
        // $userData = Wallet::select('ammount')->where('user_id', $userId)->first()->toArray();

        // echo "<pre>";
        // print_r($userData);
    }

    public function transactionHistory()
    {
        $user = auth('sanctum')->user();
        //echo "<pre>";print_r($user);
        $payment_history = TransactionHistory::where('userId', $user->id)->orderBy('created_at', 'desc')->get();

        // $payment_history = TransactionHistory::join('events', 'transaction_histories.eventId', '=', 'events.id')
        //     ->where('transaction_histories.userId', $user->id)
        //     ->select('transaction_histories.*', 'events.name as event_name')
        //     ->get();

        // if (!empty($payment_history)) {
        //     foreach ($payment_history as $key => $value) {
        //         $eventId = $value->eventId;
        //         $events = events::where('id', $eventId)->first();
        //         if ($events) {
        //             $eventName = $events->name;
        //             $value->event_name = $eventName; // Add event_name key and value
        //         }
        //     }
        // }

        // echo "<pre>";
        // print_r($payment_history);



        return response()->json([
            'status' => 200,
            'transaction' => $payment_history,
        ]);


    }

    public function showUPIQRcode(Request $request)
    {
        $UPI = UpiIdQRCode::first();

        return response()->json([
            'status' => 200,
            'upi' => $UPI,
        ]);

    }
}