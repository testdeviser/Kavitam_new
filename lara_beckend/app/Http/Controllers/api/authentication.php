<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Payment;
use App\Models\Wallet;
use App\Models\PriceMultiplyBy;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\MyTestMail;

class authentication extends Controller
{
    // when click on verify btn
    public function verifyPhone(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'phone' => 'required|numeric',
        ]);

        if ($validator->fails()) {

            return response()->json([
                'status' => 401,
                'error' => $validator->messages(),
            ]);
        } else {

            return response()->json([
                'status' => 200,
            ]);
        }
    }

    public function Register(Request $req)
    {
        // if($req->refferalCode !='' || $req->refferalCode!=null)
        // {
        //     $validator = Validator::make($req->all(), [
        //         'name' => 'required|max:191|unique:users,name',
        //         // 'email' => 'required|email|unique:users,email|indisposable',
        //         'user_password' =>'required|min:6',
        //         'phone' =>'required|numeric|unique:users,phone',
        //         'refferalCode'=>'exists:users,Refer_code',
        //     ]);
        // }
        // else
        // {
        //         $validator = Validator::make($req->all(), [
        //             'name' => 'required|max:191|unique:users,name',
        //             //'email' => 'required|email|unique:users,email|indisposable',
        //             'user_password' =>'required|min:6',
        //             'phone' =>'required|numeric|unique:users,phone',
        //          ]);
        // }

        $validator = Validator::make($req->all(), [
            // 'name' => 'required|min:3|max:191|unique:users,name',
            'name' => 'required|min:3|max:191',
            'username' => 'required|min:3|max:191|unique:users,username',
            'user_password' => 'required|min:6',
            'user_confirmpassword' => 'required|same:user_password',
            'phone' => 'numeric|digits_between:10,15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->messages(),
                'p_suggestion' => Str::random(5) . mt_rand(10000, 99999),
            ]);
        } else {

            $user_password = $req->user_password;
            $user_confirmpassword = $req->confirmpassword;
            // $mail_password=$req->mail_pass;

            // $refferalPhone_no=0;
            // if($req->refferalCode)
            // {
            //     $RefferalBy=User::where('Refer_code',$req->refferalCode)->first();
            //     if($RefferalBy)
            //     {
            //         $refferalPhone_no=$RefferalBy->phone;
            //     }
            //     else
            //     {
            //         $refferalPhone_no=null;
            //     }
            // }



            // if ($req->verify_phone == true) //to check phone verify or not
            // {
            //   if($user_password==$mail_password)  //TO match mail password or user password
            //   {

            // for sending password in mail

            // $email=$req->input('email');
            // $number =Str::random(8).mt_rand(1000000000,9999999999);
            // $mailData = [
            //     'title' => 'Mail from Gaming point',
            //     'body' => 'This is for testing email using smtp.',
            //     'password'=>$user_password,
            //     'user'=>$req->phone,
            // ];

            // Mail::to($email)->send(new MyTestMail($mailData));

            // dd("Email is sent successfully.");

            // for sending password in mail end


            //$random = md5(date('Ymdhis') . Str::random(10));

            $referralLink = Str::random(15);
            $uniqueReferralLink = $referralLink;
            if (User::where('user_referral_link', $uniqueReferralLink)->exists()) {
                $uniqueReferralLink = Str::random(15);
            }

            $user = User::create([
                'name' => $req->name,
                'username' => $req->username,
                //'last_name' => $req->lname,
                //'uniquecode' => md5(date('Ymdhis') . $req->input('email') . rand(1111111, 9999999)),
                // 'email'=> $req->email,
                'phone' => $req->phone,
                'password' => Hash::make($user_password),
                'confirm_password' => Hash::make($user_confirmpassword),
                'referredby_user_link' => $req->referredby_user_link ? $req->referredby_user_link : null,
                'user_referral_link' => $uniqueReferralLink,
                // 'Refer_code' => $random,
                // 'referredBy' => $req->refferalCode ? $req->refferalCode : null,
            ]);

            // create wallet
            $user_wallet = Wallet::create([
                ///'uniquecode' => $user->user_referral_link,
                'user_id' => $user->id,
                'currency' => 'Rupees',
                'ammount' => 0,
            ]);

            $token = $user->createToken($user->name . '_Token', [''])->plainTextToken;

            return response()->json([
                'status' => 200,
                'userid' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                // 'email'=>$user->email,
                'token' => $token,
                'message' => 'Register Successfull!!',
            ]);

            //   }  //password matched end
            //   else
            //   {

            //         return response()->json([
            //             'status' => 401,
            //             'message' => 'Please enter correct password!!',
            //         ]);
            //   }

            //} //phone verify end
            // else {
            //     return response()->json([
            //         'status' => 401,
            //         'message' => 'Phone number is not verified !!',
            //     ]);
            // }
        }
    }



    // logout
    public function logout(Request $req)
    {
        $res = $req->user()->currentAccessToken()->delete();
        if ($res) {
            return response()->json([
                'status' => 200,
                'message' => 'Logout successfully!!',
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something went wrong!!',
            ]);
        }
    }

    public function login(Request $req)
    {

        $validator = validator::make($req->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'error' => $validator->messages(),
            ]);
        } else {
            $user = User::where('username', $req->username)->first();
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Username does not exists !!',
                ]);
            } else {
                if (!Hash::check($req->password, $user->password)) {
                    return response()->json([
                        'status' => 404,
                        'message' => 'Password  did not match !!',
                    ]);
                } else {
                    if ($user->role_as == 1) {

                        $token = $user->createToken($user->name . '_AdminToken', ['server:admin'])->plainTextToken;
                        $user_is = 'admin';
                    } else {
                        $token = $user->createToken($user->name . '_Token', [''])->plainTextToken;
                        $user_is = 'user';
                    }

                    return response()->json([
                        'status' => 200,
                        'userid' => $user->id,
                        'username' => $user->username,
                        'token' => $token,
                        'message' => 'Loggedin Successfully',
                        'user' => $user_is,
                    ]);
                }

            }


        }
    }

    public function profile(Request $req)
    {
        $user = auth('sanctum')->user();
        return response()->json([
            'status' => 200,
            'user' => $user,
        ]);
    }

    public function updateUserData(Request $req)
    {
        $user = auth('sanctum')->user();
        $validator = Validator::make($req->all(), [
            'name' => 'required|max:191|unique:users,name',
            'email' => 'required',
            // 'phone' =>'required|numeric|unique:users,phone',
            'lname' => 'required',

        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->messages(),
            ]);
        } else {
            $data = User::find($user->id);
            $data->name = $req->name;
            $data->email = $req->email;
            $data->last_name = $req->lname;
            //    $data->phone=$req->phone;
            $res = $data->save();
            if ($res) {
                return response()->json([
                    'status' => 200,
                    'message' => 'profile updated successfully!!',
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'Something went wrong!!',
                ]);
            }
        }
    }

    public function payment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric',
            'refNo' => 'required|digits:12',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->messages(),
                // 'p_suggestion' => Str::random(5) . mt_rand(10000, 99999),
            ]);
        } else {

            // Fetch the user by userId
            $user = Payment::where('userId', $request->userId)->first();
            // Check if the user has a bonus (bonus column value is 1)
            $hasBonus = $user && $user->bonus == 1;

            // Calculate the bonus (10% of $request->amount) only if the user has no bonus (bonus is 0)
            $bonus = $hasBonus ? 0 : $request->amount * 0.1;
            $totalAmount = $bonus + $request->amount;

            $payment = Payment::create([
                'userId' => $request->userId,
                'username' => $request->username,
                'amount' => $totalAmount,
                'refNo' => $request->refNo,
                'bonus' => $hasBonus ? 0 : 1, // Set bonus value based on whether the user has a bonus or not
            ]);

            // $payment = Payment::create([
            //     'userId' => $request->userId,
            //     'username' => $request->username,
            //     'amount' => $request->amount,
            //     'refNo' => $request->refNo,
            // ]);

            //$token = $payment->createToken($payment->name . '_Token', [''])->plainTextToken;

            return response()->json([
                'status' => 200,
                'userId' => $payment->userId,
                'amount' => $payment->amount,
                'refNo' => $payment->refNo,
                'message' => 'Payment done successfully',
            ]);


        }

    }

    public function changePasswordd(Request $request)
    {
        $validator = validator::make($request->all(), [
            'oldPassword' => 'required',
            // 'newPassword' => 'required|min:6',
            // 'confirmPassword' => 'required|same:newassword',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'error' => $validator->messages(),
            ]);
        } else {
            $user = auth('sanctum')->user();
            if (!Hash::check($request->oldPassword, $user->password)) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Password  did not match !!',
                ]);
            }
        }
    }


    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'oldPassword' => 'required',
            'newPassword' => 'required|min:6',
            'confirmPassword' => 'required|same:newPassword',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'error' => $validator->messages(),
            ]);
        }

        $user = auth('sanctum')->user();
        if (!Hash::check($request->oldPassword, $user->password)) {
            return response()->json([
                'status' => 404,
                'message' => 'Old Password did not match!',
            ]);
        }

        // Update the user's password here
        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'Password changed successfully!',
        ]);
    }

    public function priceMultiplyBy(Request $request)
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
            $priceNumbers = PriceMultiplyBy::create([
                'main' => $request->main,
                'ander' => $request->ander,
                'bahar' => $request->bahar,
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Numbers added Successfully!!',
            ]);
        }


    }

    // public function PriceMultiplyBy(Request $req)
    // {
    //     $validator = Validator::make($req->all(), [
    //         'main' => 'required',
    //         'ander' => 'required',
    //         'bahar' => 'required',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'status' => 401,
    //             'error' => $validator->messages(),
    //         ]);
    //     } else {
    //         $user = PriceMultiplyBy::create([
    //             'main' => $req->main,
    //             'ander' => $req->ander,
    //             'bahar' => $req->bahar,
    //         ]);

    //         return response()->json([
    //             'status' => 200,
    //             'message' => 'Numbers added Successfully!!',
    //         ]);

    //     }
    // }





}