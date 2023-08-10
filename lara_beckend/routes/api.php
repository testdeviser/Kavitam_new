<?php

use App\Http\Controllers\adminApi\PaymentController;
use App\Http\Controllers\api\BankController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainNumbersController;
use App\Http\Controllers\innerController;
use App\Http\Controllers\OuterController;
use App\Http\Controllers\api\authentication;
use App\Http\Controllers\MailController;
use App\Http\Controllers\ForgotPasswordController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\adminApi\mainController;
use App\Http\Controllers\adminApi\internalController;
use App\Http\Controllers\adminApi\outerPartController;
use App\Http\Controllers\adminApi\UserController;
use App\Http\Controllers\adminApi\walletController;
use App\Http\Controllers\api\transactionController;
use App\Http\Controllers\api\sidebarController;
use App\Http\Controllers\api\MynumbersController;
use App\Http\Controllers\adminApi\AdminEventController;


// main
Route::post('/mainNumber/create', [MainNumbersController::class, 'create']);
// Route::get('/mainNumber/fetch', [MainNumbersController::class, 'fetchMain']);
// Route::get('/mainNum/fetch/{eventid}', [MainNumbersController::class, 'fetchMain']);
// Route::get('/mainNum/fetch/{eventid}/{userid}', [MainNumbersController::class, 'fetchMain']);
Route::post('/mainNumber/remove/{id}', [MainNumbersController::class, 'remove']);

// inner
Route::post('/innerNumber/create', [innerController::class, 'create']);
// Route::get('/innerNumber/fetch', [innerController::class, 'fetchInner']);
// Route::get('/innerNum/fetch/{eventid}/{userid}', [innerController::class, 'fetchIner']);
Route::post('/innerNumber/remove/{id}', [innerController::class, 'remove']);


//outer
Route::post('/outerNumber/create', [OuterController::class, 'create']);
// Route::get('/outerNumber/fetch', [OuterController::class, 'fetchOuter']);
// Route::get('/outerNum/fetch/{eventid}/{userid}', [OuterController::class, 'ftchOuter']);
Route::post('/outerNumber/remove/{id}', [OuterController::class, 'remove']);
//Route::post('/outerNumber/remove/{number}/{username}', [OuterController::class, 'remove']);


// Register
Route::post('/user/Register', [authentication::class, 'Register']);
// login
Route::post('/user/login', [authentication::class, 'login'])->name('loginn');
Route::post('/user/changePassword', [authentication::class, 'changePassword'])->name('changePassword');
Route::post('/user/addBankAccount', [BankController::class, 'index'])->name('addBankAccount');
Route::post('/user/editBankAccount', [BankController::class, 'editBankAccount'])->name('editBankAccount');
Route::post('/user/moneyWithdrawal', [BankController::class, 'moneyWithdrawal'])->name('moneyWithdrawal');
Route::get('/user/bankDetails/{userId}', [BankController::class, 'bankDetails'])->name('bankDetails');

// check phone already exist or not in db when click
Route::post('/checkPhone', [authentication::class, 'verifyPhone']);

// forgot password
Route::post('forget-password', [ForgotPasswordController::class, 'submitForgetPasswordForm'])->name('forget.password.post');
Route::get('reset-password/{token}', [ForgotPasswordController::class, 'showResetPasswordForm'])->name('reset.password.get');
Route::post('reset-password', [ForgotPasswordController::class, 'submitResetPasswordForm'])->name('reset.password.post');

// mail
Route::post('/send-mail', [MailController::class, 'index']);

// ---------------------------------------------------------------admin------------------------------------------------------------
// to check logggedIn user is admin or not
Route::group(['middleware' => ['auth:sanctum', 'isAdmin']], function () {
  Route::get('/AuthCheck', function () {
    return response()->json([
      'status' => 200,
      'message' => 'Welcome',
    ]);
  }, []);
});


Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {

  //main
  // Route::get('/admin/main/fetch', [mainController::class, 'fetch'])->name('fetchMain');
  Route::get('/admin/mainNumber/fetch/{eventid}', [MynumbersController::class, 'fetchMainNumber'])->name('fetchMainNumber');
  //Route::get('/admin/Numbers/fetch/{eventid}', [MynumbersController::class, 'fetchNumbers'])->name('fetchNumbers');

  Route::delete('/admin/main/delete/{id}', [mainController::class, 'delete']);

  // inner
  Route::get('/admin/internal/fetch', [internalController::class, 'fetch'])->name('fetchInternal');
  Route::delete('/admin/internal/delete/{id}', [internalController::class, 'delete']);

  // outer
  Route::get('/admin/outer/fetch', [outerPartController::class, 'fetch']);
  Route::delete('/admin/outer/delete/{id}', [outerPartController::class, 'delete'])->name('outeDelete');

  // wallet
  Route::get('/admin/wallet/list', [walletController::class, 'index']);

  //user
  Route::get('/admin/users', [UserController::class, 'index'])->name('user_data');

  //events
  Route::get('/admin/events/fetch', [AdminEventController::class, 'Index'])->name('Show_invents');
  Route::post('/admin/events/create', [AdminEventController::class, 'Create'])->name('create_events');
  Route::delete('/admin/events/delete/{id}', [AdminEventController::class, 'delete']);
  Route::get('/admin/events/editdata/{id}', [AdminEventController::class, 'EditData'])->name('edit_event_data');
  Route::post('/admin/events/update_events/{id}', [AdminEventController::class, 'update'])->name('uddate');
  //Route::post('/result', [transactionController::class, 'Result'])->name('Result');


  Route::post('/annouce_result', [transactionController::class, 'Annouce_Result']);

  //priceMultiplyBy
  Route::get('/admin/fetchPriceMultiplyBy', [AdminEventController::class, 'fetchPriceMultiplyBy']);
  Route::post('/priceMultiplyBy', [authentication::class, 'priceMultiplyBy'])->name('priceMultiplyBy');
  Route::post('/admin/PriceMultiplyByUpdate/{id}', [AdminEventController::class, 'PriceMultiplyByUpdate'])->name('PriceMultiplyByUpdate');

  //UPIQR
  Route::get('/admin/fetchUPIQRcode', [AdminEventController::class, 'fetchUPIQRcode']);
  Route::post('/admin/UpiIdQRUpdate/{id}', [AdminEventController::class, 'UpiIdQRUpdate'])->name('UpiIdQRUpdate');

  //payments
  Route::get('/admin/payments/fetch', [PaymentController::class, 'Index'])->name('Show_payments');
  Route::get('/admin/payments/editdata/{id}', [PaymentController::class, 'EditData'])->name('edit_payment_data');
  Route::post('/admin/payments/update_payments/{id}', [PaymentController::class, 'update'])->name('update');

  //withdrawals
  Route::get('/admin/withdrawals/fetch', [PaymentController::class, 'withdrawals'])->name('withdrawals');
  Route::post('/admin/withdrawal/update_withdrawals/{id}', [PaymentController::class, 'updateWithdrawals'])->name('updateWithdrawals');

  //withdrawalHistory

  Route::get('/admin/withdrawalHistory/fetch', [PaymentController::class, 'withdrawalHistory'])->name('withdrawalHistory');

  //pendingWithdrawals

  Route::get('/admin/pendingWithdrawal/fetch', [PaymentController::class, 'pendingWithdrawal'])->name('pendingWithdrawal');
  Route::post('/admin/pendingWithdrawal/update_pendingWithdrawal/{id}', [PaymentController::class, 'updatependingWithdrawal'])->name('updatependingWithdrawal');

  //Route::get('/fetch/finalNumber/{eventid}/{currentTime}/{eventsTime}', [MynumbersController::class, 'finalNumber']);
  Route::get('/fetch/finalNumber/{eventid}/{eventsTime}', [MynumbersController::class, 'finalNumber']);

});

Route::get('/result', [transactionController::class, 'Result'])->name('Result');

Route::get('/admin/Numbers/fetch/{eventid}', [MynumbersController::class, 'fetchNumbers'])->name('fetchNumbers');

Route::post('/randNum/{event_id}', [transactionController::class, 'Result'])->name('randNum');
Route::post('/finalResult/{event}/{number}/{eventsTime}', [transactionController::class, 'finalResult']);

//Route::get('/test/{event_id}', [transactionController::class, 'Result'])->name('test');

Route::post('/final_result', [transactionController::class, 'Result'])->name('Resultt');

// Route::get('/result',[transactionController::class,'Result'])->name('Result');
// ---------------------------------------------------------------admin end---------------------------------------------------------

Route::middleware('auth:sanctum')->group(function () {
  Route::get('Auth4Normal/user', function () {
    return response()->json([
      'status' => 200,
      'message' => 'wellcome!',
    ]);
  });
});

Route::get('user/wallet/fetch', [transactionController::class, 'fetch_user_wallet'])->name('fetch_user_wallet'); // fetch user wallet ammount in sidebar
Route::post('/user/wallet/decrease', [transactionController::class, 'decrease_Ammount'])->name('decrease_wallet'); //decrease wallet ammount 
// Route::get('/user/wallet/decrease', [transactionController::class, 'decrease_Ammount'])->name('decrease_wallet'); //decrease wallet ammount 

Route::middleware('auth:sanctum')->group(function () {

  Route::post('/logout', [authentication::class, 'logout'])->name('logoutt');
  Route::get('/mynumber/fetch', [MynumbersController::class, 'fetchMynumbers'])->name('fetchMynumbers');
  //  fetch event in front end
  Route::get('/events/fetch', [AdminEventController::class, 'Fetch_Event_in_Front']);

  Route::get('/events/AlreadyPlay/{event_id}', [transactionController::class, 'AlreadyPlay_this_event']);

  Route::get('/profile', [authentication::class, 'Profile']);
  //  update user data
  Route::post('/update/user', [authentication::class, 'updateUserData']);
  Route::post('/payment-history', [transactionController::class, 'paymentHistory']);
  Route::get('fetch/payment-history', [transactionController::class, 'fetchpayment_history']);
  Route::get('transactionHistory', [transactionController::class, 'transactionHistory']);

  // refferral code
  Route::post('/send-RefferalCode', [transactionController::class, 'RefferalLink']);
  // Route::get('/fetch-userRefferal-code', [transactionController::class, 'fetchRefferal_code']);
  // Route::get('/refferralCommission', [transactionController::class, 'fetch_referral_commission']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});
Route::get('/Sidebar/mainNumber/fetch', [sidebarController::class, 'fetchMain']);
Route::get('/Sidebar/innerNumber/fetch', [sidebarController::class, 'fetchInner']);
Route::get('/Sidebar/outerNumber/fetch', [sidebarController::class, 'fetchOuter']);

//  Live Result Today
Route::get('/Result_today', [MynumbersController::class, 'Live_result_today']);
Route::get('/Result_by_date/{date}', [MynumbersController::class, 'Result_by_date']);
Route::get('/fetch_all_events', [MynumbersController::class, 'fetch_all_events']);
Route::get('/events/fetch', [AdminEventController::class, 'Fetch_Event_in_Front']);


Route::get('/todayActiveEvents', [MynumbersController::class, 'todayActiveEvents']);
Route::get('/todayActiveEventsLive', [MynumbersController::class, 'todayActiveEventsLive']);

Route::get('/mainNumber/fetch/{eventid}/{userid}', [MynumbersController::class, 'fetchNumber']);





Route::get('/fetch-userRefferalCode/{userid}', [transactionController::class, 'fetchRefferalCode']);
Route::get('/fetchWalletBalance', [transactionController::class, 'fetchWalletBalance']);

Route::post('/user/payment', [authentication::class, 'payment']);
Route::get('/refferralCommission', [transactionController::class, 'fetch_referral_commission']);
Route::get('/numberHistory', [transactionController::class, 'numberHistory']);
Route::get('/fetchEventsUserPlayed', [MynumbersController::class, 'fetchEventsUserPlayed']);

Route::get('/getEventData/{eventid}', [MynumbersController::class, 'getEventData']);

Route::get('/fetchBankData', [BankController::class, 'fetchBankData']);

Route::get('/showUPIQRcode', [transactionController::class, 'showUPIQRcode']);