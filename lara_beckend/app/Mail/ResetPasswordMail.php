<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $resetLink;
    public $email;

    /**
     * Create a new message instance.
     *
     * @return void
     */

    public function __construct($email)
    {
        $this->email = $email;
    }

    // public function __construct($resetLink)
    // {
    //     $this->resetLink = $resetLink;
    // }

    /**
     * Build the message.
     *
     * @return $this
     */

    public function build()
    {
        return $this->from('kavi998854@gmail.com', 'Developer Test')
            ->subject('Reset Password Link')
            ->view('emails.reset_password');
        // ->markdown('emails.subscribers');
    }


    // public function build()
    // {
    //     return $this->from('test@example.com', 'Dev test')
    //         ->view('emails.reset_password')
    //         ->subject('Reset Password');
    // }
}