<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\MyTestMail;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class MailController extends Controller
{
    public function index(Request $req)
    {

        $validator=Validator::make($req->all(),[
            'email'=>'required|email',
        ]);
        if($validator->fails())
        {
           return response()->json([
            'status'=>401,
            'error'=>$validator->messages(),
           ]);          
        }
        else
        {

            
            $email=$req->input('email');
            $number = mt_rand(1000000000, 9999999999);
            $mailData = [
                'title' => 'Mail from Gaming point',
                'body' => 'This is for testing email using smtp.',
                'password'=>$number
            ];

            Mail::to($email)->send(new MyTestMail($mailData));
               
            // dd("Email is sent successfully.");
            return response()->json(['status'=>200,"message" => "Password successfully sent in your gmail account.",'password'=>$number]);
        }
     
    }


   
}
