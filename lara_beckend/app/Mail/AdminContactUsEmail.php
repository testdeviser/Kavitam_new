<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminContactUsEmail extends Mailable
{
    use Queueable, SerializesModels;

    //public $email;
    public $contact;

    /**
     * Create a new message instance.
     *
     * @return void
     */

    public function __construct($contact)
    {
        $this->contact = $contact;
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
            ->subject('Contact Us')
            //->view('emails.reset_password');
            ->view('emails.adminContact_us');
        // ->markdown('emails.subscribers');
    }


    // public function build()
    // {
    //     return $this->from('test@example.com', 'Dev test')
    //         ->view('emails.reset_password')
    //         ->subject('Reset Password');
    // }
}