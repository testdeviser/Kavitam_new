<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\EventResult;
use Illuminate\Http\Request;
use App\Models\inner;
use App\Models\MainNumbers;
use App\Models\outer;
use App\Models\events;
use App\Models\user;
use Carbon\Carbon;

class MynumbersController extends Controller
{

    public function fetchNumber(Request $request)
    {
        $userId = $request->userid;
        $eventId = $request->eventid;
        $currentDate = Carbon::now()->format('Y-m-d');
        $main = MainNumbers::select('number')
            ->where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('current_date', $currentDate)
            ->where('payment_status', 1)
            ->selectRaw('SUM(prize) as total_price')
            ->groupBy('number')
            ->orderByDesc('total_price')
            ->get();
        $inner = inner::select('number')
            ->where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('current_date', $currentDate)
            ->where('payment_status', 1)
            ->selectRaw('SUM(price) as total_price')
            ->groupBy('number')
            ->orderByDesc('total_price')
            ->get();
        $outer = outer::select('number')
            ->where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('current_date', $currentDate)
            ->where('payment_status', 1)
            ->selectRaw('SUM(price) as total_price')
            ->groupBy('number')
            ->orderByDesc('total_price')
            ->get();
        return response()->json(['status' => 200, 'main' => $main, 'inner' => $inner, 'outer' => $outer]);

    }

    public function fetchMynumbers()
    {
        //echo "testing";die;
        $user = auth('sanctum')->user();
        $main = MainNumbers::where('userId', $user->id)->where('payment_status', 1)->get();
        $inner = inner::where('userId', $user->id)->where('payment_status', 1)->get();
        $outer = outer::where('userId', $user->id)->where('payment_status', 1)->get();
        $events = events::where('result', '!=', null)->get();
        return response()->json([
            'status' => 200,
            'main' => $main,
            'inner' => $inner,
            'outer' => $outer,
            'event' => $events,
        ]);
    }

    public function Live_result_today()
    {
        //$result = events::where('result', '!=', null)->orderByDesc('id')->get();
        //$result = EventResult::orderByDesc('id')->get();
        $currentDate = Carbon::now()->format('Y-m-d');
        $result = EventResult::where('current_date', $currentDate)->orderBy('id')->get();
        if (!empty($result)) {
            foreach ($result as $key => $value) {
                $resVal = $value->result;
                if ($resVal < 10) {
                    $num_padded = sprintf("%02d", $resVal);
                    $numberkey = (string) $num_padded;
                    $value->result = $numberkey;
                } else {
                    $value->result = $value->result;
                }
            }
        }

        if ($result) {
            return response()->json([
                'status' => 200,
                'event' => $result,
            ]);
        } else {
            return response()->json([
                'status' => 200,
                'message' => 'Empty!',
            ]);
        }

    }

    public function Result_by_date(Request $request)
    {
        $date = $request->date;
        $result = EventResult::where('current_date', $date)->orderByDesc('id')->get();
        if (!empty($result)) {
            foreach ($result as $key => $value) {
                $resVal = $value->result;
                if ($resVal < 10) {
                    $num_padded = sprintf("%02d", $resVal);
                    $numberkey = (string) $num_padded;
                    $value->result = $numberkey;
                } else {
                    $value->result = $value->result;
                }
            }
        }

        if ($result) {
            return response()->json([
                'status' => 200,
                'event' => $result,
            ]);
        } else {
            return response()->json([
                'status' => 200,
                'message' => 'Empty!',
            ]);
        }
    }

    public function fetch_all_events()
    {
        //$result = EventResult::orderByDesc('id')->get();
        $currentDate = Carbon::now()->format('Y-m-d');
        $result = EventResult::where('current_date', '!=', $currentDate)
            ->orderByDesc('id')
            ->get();
        if (!empty($result)) {
            foreach ($result as $key => $value) {
                $resVal = $value->result;
                if ($resVal < 10) {
                    $num_padded = sprintf("%02d", $resVal);
                    $numberkey = (string) $num_padded;
                    $value->result = $numberkey;
                } else {
                    $value->result = $value->result;
                }
            }
        }

        if ($result) {
            return response()->json([
                'status' => 200,
                'allEventResult' => $result,
            ]);
        } else {
            return response()->json([
                'status' => 200,
                'message' => 'Empty!',
            ]);
        }
    }

    public function todayActiveEvents_old(Request $request)
    {
        $currentDate = Carbon::now()->format('Y-m-d');
        $currentTime = Carbon::now()->timezone('Asia/Kolkata');
        $currentTime1 = Carbon::now()->timezone('Asia/Kolkata')->format('H:i:s');
        $events = events::whereDate('event_date', $currentDate)->where('status', '1')->get();
        //echo "<pre>";print_r($events);die;
        //$minTimeDifference = null; // Variable to store the minimum time difference
        //$closestEvent = null; // Variable to store the closest event

        $closestEventId = false;
        $closestEventTime = '';
        $message = 'No active events found';
        foreach ($events as $key => $event) {
            $event_date = $event->event_date;
            $time = Carbon::parse($event_date)->format('H:i:s');
            $eventTime = Carbon::parse($time);
            $currentTimeObj = Carbon::parse($currentTime1);
            $difference = $currentTimeObj->diffInMinutes($eventTime);
            //$timeDifference = $currentTimeObj->diffInSeconds($eventTime);

            if ($currentTime1 >= $time && $difference <= 60) {
                $closestEvent = $event;
                $closestEventId = $closestEvent->id;
                $closestEventTime = $closestEvent->event_date;
                $closestEventTime = Carbon::parse($closestEventTime)->format('H:i:s');
                $message = '';
            }
        }

        return response()->json([
            'status' => 200,
            //'events' => $events,
            'time' => $closestEventTime,
            'currentTime1' => $currentTime1,
            'event_id' => $closestEventId,
            'message' => $message,
        ]);

    }

    public function todayActiveEvents(Request $request)
    {
        $currentDate = Carbon::now()->format('Y-m-d');
        $currentTime = Carbon::now()->timezone('Asia/Kolkata');
        $currentTime1 = Carbon::now()->timezone('Asia/Kolkata')->format('H:i:s');
        $events = events::where('status', '1')->get();
        //echo "<pre>";print_r($events);die;
        //$minTimeDifference = null; // Variable to store the minimum time difference
        //$closestEvent = null; // Variable to store the closest event

        $closestEventId = false;
        $closestEventTime = '';
        $message = 'No active events found';
        foreach ($events as $key => $event) {
            $event_date = $event->event_date;
            $time = Carbon::parse($event_date)->format('H:i:s');
            $eventTime = Carbon::parse($time);
            $currentTimeObj = Carbon::parse($currentTime1);
            $difference = $currentTimeObj->diffInMinutes($eventTime);
            //$timeDifference = $currentTimeObj->diffInSeconds($eventTime);

            if ($currentTime1 >= $time && $difference <= 60) {
                $closestEvent = $event;
                $closestEventId = $closestEvent->id;
                $closestEventTime = $closestEvent->event_date;
                $closestEventTime = Carbon::parse($closestEventTime)->format('H:i:s');
                $message = '';
            }
        }

        return response()->json([
            'status' => 200,
            //'events' => $events,
            'time' => $closestEventTime,
            'currentTime1' => $currentTime1,
            'event_id' => $closestEventId,
            'message' => $message,
        ]);

    }

    public function todayActiveEventsLive(Request $request)
    {
        $currentDate = Carbon::now()->format('Y-m-d');
        $currentTime = Carbon::now()->timezone('Asia/Kolkata');
        $currentTime1 = Carbon::now()->timezone('Asia/Kolkata')->format('H:i');
        $events = events::where('status', '1')->get();
        //echo "<pre>";print_r($events);die;
        //$minTimeDifference = null; // Variable to store the minimum time difference
        //$closestEvent = null; // Variable to store the closest event

        $closestEventId = false;
        $closestEventTime = '';
        $message = 'No active events found';
        foreach ($events as $key => $event) {
            $event_date = $event->event_date;
            $time = Carbon::parse($event_date)->format('H:i');
            $eventTime = Carbon::parse($time);
            $currentTimeObj = Carbon::parse($currentTime1);
            $difference = $currentTimeObj->diffInMinutes($eventTime);
            //$timeDifference = $currentTimeObj->diffInSeconds($eventTime);

            if ($currentTime1 >= $time && $difference <= 60) {
                $closestEvent = $event;
                $closestEventId = $closestEvent->id;
                $closestEventTime = $closestEvent->event_date;
                $closestEventTime = Carbon::parse($closestEventTime)->format('H:i');

                $closestEventTimeNew = Carbon::parse($closestEventTime)->format('H:i');

                //$formattedClosestEventTime = Carbon::createFromFormat('H:i', $closestEventTimeNew)->addHour();
                $formattedClosestEventTime = Carbon::createFromFormat('H:i', $closestEventTimeNew)->addMinutes(59);

                // Format the time without seconds (HH:MM format)
                $formattedClosestEventTime = $formattedClosestEventTime->format('H:i');
                //Log::info($formattedClosestEventTime);exit;
                $message = '';
            }
        }

        return response()->json([
            'status' => 200,
            //'events' => $events,
            //'time' => $formattedClosestEventTime,
            'addHourTime' => $formattedClosestEventTime,
            'time' => $closestEventTime,
            'currentTime1' => $currentTime1,
            'event_id' => $closestEventId,
            'message' => $message,
        ]);

    }




    public function fetchEventsUserPlayed_old(Request $request)
    {
        $user = auth('sanctum')->user();
        $userId = auth('sanctum')->user()->id;
        $currentDate = Carbon::now()->format('Y-m-d');
        $startOfWeek = Carbon::now()->startOfWeek()->format('Y-m-d');
        $endOfWeek = Carbon::now()->endOfWeek()->format('Y-m-d');
        $mainToday = MainNumbers::whereDate('created_at', $currentDate)
            ->where('userId', $userId)
            ->where('payment_status', '1')
            ->get();
        $mainWeekly = MainNumbers::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->get();
        $mainMonthly = MainNumbers::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereMonth('created_at', Carbon::now()->month)
            ->get();

        $innerToday = inner::whereDate('created_at', $currentDate)
            ->where('userId', $userId)
            ->where('payment_status', '1')
            ->get();
        $innerWeekly = inner::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->get();
        $innerMonthly = inner::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereMonth('created_at', Carbon::now()->month)
            ->get();

        $outerToday = outer::whereDate('created_at', $currentDate)
            ->where('userId', $userId)
            ->where('payment_status', '1')
            ->get();
        $outerWeekly = outer::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->get();
        $outerMonthly = outer::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereMonth('created_at', Carbon::now()->month)
            ->get();

        $resultToday = $mainToday->concat($innerToday)->concat($outerToday);
        $resultWeekly = $mainWeekly->concat($innerWeekly)->concat($outerWeekly);
        $resultMonthly = $mainMonthly->concat($innerMonthly)->concat($outerMonthly);

        //start today
        $uniqueEventIds = [];
        foreach ($resultToday as $key => $value) {
            $eventId = $value->event_id;
            $uniqueEventIds[] = $eventId;
        }

        $uniqueEventIds = array_unique($uniqueEventIds);
        $eventsData = [];

        foreach ($uniqueEventIds as $eventId) {
            $event = events::find($eventId);
            $event_date = $event->event_date;

            $formattedEventDate = Carbon::createFromFormat('Y-m-d H:i:s', $event_date)->format('F d, Y, h:i A');
            $eventResult = $event->result;

            if ($eventResult < 10 && $eventResult != '') {
                $num_padded = sprintf("%02d", $eventResult);
                $numberkey = $num_padded;
            } else {
                $numberkey = $event->result;
            }

            $firstDigit = '';
            $scndDigit = '';
            if (!empty($numberkey)) {
                $digits1 = str_split($numberkey);
                $firstDigit = intval($digits1[0]);
                $scndDigit = intval($digits1[1]);
            }

            $eventsData[] = [
                'event_id' => $event->id,
                'event_name' => $event->name,
                'event_date' => $formattedEventDate,
                'result' => $numberkey,
                'firstDigit' => $firstDigit,
                'scndDigit' => $scndDigit,
            ];
        }
        //end today

        //Weekly
        $uniqueEventIdsWeekly = [];
        foreach ($resultWeekly as $key => $value) {
            $eventIdWeekly = $value->event_id;
            $uniqueEventIdsWeekly[] = $eventIdWeekly;
        }

        $uniqueEventIdsWeekly = array_unique($uniqueEventIdsWeekly);
        $eventsDataWeekly = [];

        foreach ($uniqueEventIdsWeekly as $eventIdWeekly) {
            $eventWeekly = events::find($eventIdWeekly);
            $event_dateWeekly = $eventWeekly->event_date;

            $formattedEventDateWeekly = Carbon::createFromFormat('Y-m-d H:i:s', $event_dateWeekly)->format('F d, Y, h:i A');
            $eventResultWeekly = $eventWeekly->result;

            if ($eventResultWeekly < 10 && $eventResultWeekly != '') {
                $num_paddedWeekly = sprintf("%02d", $eventResultWeekly);
                $numberkeyWeekly = $num_paddedWeekly;
            } else {
                $numberkeyWeekly = $eventWeekly->result;
            }

            $firstDigitWeekly = '';
            $scndDigitWeekly = '';
            if (!empty($numberkeyWeekly)) {
                $digits1Weekly = str_split($numberkeyWeekly);
                $firstDigitWeekly = intval($digits1Weekly[0]);
                $scndDigitWeekly = intval($digits1Weekly[1]);
            }

            $eventsDataWeekly[] = [
                'event_idWeekly' => $eventWeekly->id,
                'event_nameWeekly' => $eventWeekly->name,
                'event_dateWeekly' => $formattedEventDateWeekly,
                'resultWeekly' => $numberkeyWeekly,
                'firstDigitWeekly' => $firstDigitWeekly,
                'scndDigitWeekly' => $scndDigitWeekly,
            ];
        }
        //endweekly

        //Monthly
        $uniqueEventIdsMonthly = [];
        foreach ($resultMonthly as $key => $value) {
            $eventIdMonthly = $value->event_id;
            $uniqueEventIdsMonthly[] = $eventIdMonthly;
        }

        $uniqueEventIdsMonthly = array_unique($uniqueEventIdsMonthly);
        $eventsDataMonthly = [];

        foreach ($uniqueEventIdsMonthly as $eventIdMonthly) {
            $eventMonthly = events::find($eventIdMonthly);
            $event_dateMonthly = $eventMonthly->event_date;

            $formattedEventDateMonthly = Carbon::createFromFormat('Y-m-d H:i:s', $event_dateMonthly)->format('F d, Y, h:i A');
            $eventResultMonthly = $eventMonthly->result;

            if ($eventResultMonthly < 10 && $eventResultMonthly != '') {
                $num_paddedMonthly = sprintf("%02d", $eventResultMonthly);
                $numberkeyMonthly = $num_paddedMonthly;
            } else {
                $numberkeyMonthly = $eventMonthly->result;
            }

            $firstDigitMonthly = '';
            $scndDigitMonthly = '';
            if (!empty($numberkeyMonthly)) {
                $digits1Monthly = str_split($numberkeyMonthly);
                $firstDigitMonthly = intval($digits1Monthly[0]);
                $scndDigitMonthly = intval($digits1Monthly[1]);
            }

            $eventsDataMonthly[] = [
                'event_idMonthly' => $eventMonthly->id,
                'event_nameMonthly' => $eventMonthly->name,
                'event_dateMonthly' => $formattedEventDateMonthly,
                'resultMonthly' => $numberkeyMonthly,
                'firstDigitMonthly' => $firstDigitMonthly,
                'scndDigitMonthly' => $scndDigitMonthly,
            ];
        }
        //endMonthly

        $responseData = [
            'events' => $eventsData,
            'eventsWeekly' => $eventsDataWeekly,
            'eventsMonthly' => $eventsDataMonthly,
            // 'mainToday' => $mainToday,
            // 'innerToday' => $innerToday,
            // 'outerToday' => $outerToday,
        ];

        return response()->json($responseData);
    }

    public function fetchEventsUserPlayed(Request $request)
    {
        $user = auth('sanctum')->user();
        $userId = auth('sanctum')->user()->id;
        $currentDate = Carbon::now()->format('Y-m-d');
        $startOfWeek = Carbon::now()->startOfWeek()->format('Y-m-d');
        $endOfWeek = Carbon::now()->endOfWeek()->format('Y-m-d');
        $mainToday = MainNumbers::whereDate('created_at', $currentDate)
            ->where('userId', $userId)
            ->where('payment_status', '1')
            ->get();
        $mainWeekly = MainNumbers::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->get();
        $mainMonthly = MainNumbers::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereMonth('created_at', Carbon::now()->month)
            ->get();

        $innerToday = inner::whereDate('created_at', $currentDate)
            ->where('userId', $userId)
            ->where('payment_status', '1')
            ->get();
        $innerWeekly = inner::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->get();
        $innerMonthly = inner::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereMonth('created_at', Carbon::now()->month)
            ->get();

        $outerToday = outer::whereDate('created_at', $currentDate)
            ->where('userId', $userId)
            ->where('payment_status', '1')
            ->get();
        $outerWeekly = outer::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->get();
        $outerMonthly = outer::where('userId', $userId)
            ->where('payment_status', '1')
            ->whereMonth('created_at', Carbon::now()->month)
            ->get();

        $resultToday = $mainToday->concat($innerToday)->concat($outerToday);
        $resultWeekly = $mainWeekly->concat($innerWeekly)->concat($outerWeekly);
        $resultMonthly = $mainMonthly->concat($innerMonthly)->concat($outerMonthly);

        //start today
        $uniqueEventIds = [];
        foreach ($resultToday as $key => $value) {
            $eventId = $value->event_id;
            $uniqueEventIds[] = $eventId;
        }

        $uniqueEventIds = array_unique($uniqueEventIds);
        $eventsData = [];

        foreach ($uniqueEventIds as $eventId) {
            $event = events::find($eventId);
            $eventId = $event->id;
            $eventDate = $event->event_date;

            // Parse the date string into a Carbon instance
            $event_date = Carbon::parse($eventDate);
            $time = $event_date->format('h:i A'); // Output: '10:00 AM'
            $fullHrsTime = $event_date->format('h:i:s'); // Output: '10:00:00'
            $time24hours = $event_date->toTimeString(); // Output: '16:00:00'

            $eventDataMain = MainNumbers::where('event_id', $eventId)->get();
            $eventDataInner = inner::where('event_id', $eventId)->get();
            $eventDataOuter = outer::where('event_id', $eventId)->get();

            $eventData = $eventDataMain->concat($eventDataInner)->concat($eventDataOuter);

            foreach ($eventData as $key => $value) {
                $eventNewDate = $value->current_date;
                // Parse the date string into a Carbon instance
                $carbonInstance = Carbon::parse($eventNewDate);
                // Format the date in the desired format
                $formattedDate = $carbonInstance->format('F d, Y'); // Output: 'July 31, 2023'

                $eventPlayedDate = $formattedDate . ', ' . $time;
                $todayResult = EventResult::where('event_id', $eventId)
                    ->where('event_time', $time24hours)
                    ->where('current_date', $eventNewDate)
                    ->first();

                if (!empty($todayResult) && isset($todayResult->result) && $todayResult->result < 10) {
                    $num_padded = sprintf("%02d", $todayResult->result);
                    $finalResult = $num_padded;
                } elseif (!empty($todayResult) && isset($todayResult->result)) {
                    $finalResult = $todayResult->result;
                } else {
                    $finalResult = '';
                }

                $firstDigit = '';
                $scndDigit = '';
                if (!empty($finalResult)) {
                    $digits1 = str_split($finalResult);
                    $firstDigit = intval($digits1[0]);
                    $scndDigit = intval($digits1[1]);
                }
            }

            $eventsData[] = [
                'event_id' => $event->id,
                'event_name' => $event->name,
                'event_date' => $eventPlayedDate,
                'result' => $finalResult,
                'firstDigit' => $firstDigit,
                'scndDigit' => $scndDigit,
            ];

        }

        //die;
        //end today

        //Weekly
        $uniqueEventIdsWeekly = [];
        foreach ($resultWeekly as $key => $value) {
            $eventIdWeekly = $value->event_id;
            $uniqueEventIdsWeekly[] = $eventIdWeekly;
        }

        $uniqueEventIdsWeekly = array_unique($uniqueEventIdsWeekly);
        $eventsDataWeekly = [];

        foreach ($uniqueEventIdsWeekly as $eventIdWeekly) {
            $eventWeekly = events::find($eventIdWeekly);
            $eventIdWeekly = $eventWeekly->id;
            $eventDateWeekly = $eventWeekly->event_date;

            // Parse the date string into a Carbon instance
            $event_dateWeekly = Carbon::parse($eventDateWeekly);
            $timeWeekly = $event_dateWeekly->format('h:i A'); // Output: '10:00 AM'
            $fullHrsTimeWeekly = $event_dateWeekly->format('h:i:s'); // Output: '10:00:00'

            $time24hoursWeekly = $event_dateWeekly->toTimeString(); // Output: '16:00:00'

            $eventDataMainWeekly = MainNumbers::where('event_id', $eventIdWeekly)->get();
            $eventDataInnerWeekly = inner::where('event_id', $eventIdWeekly)->get();
            $eventDataOuterWeekly = outer::where('event_id', $eventIdWeekly)->get();

            $eventDataWeekly = $eventDataMainWeekly->concat($eventDataInnerWeekly)->concat($eventDataOuterWeekly);

            foreach ($eventDataWeekly as $key => $value) {
                $eventNewDateWeekly = $value->current_date;
                // Parse the date string into a Carbon instance
                $carbonInstanceWeekly = Carbon::parse($eventNewDateWeekly);
                // Format the date in the desired format
                $formattedDateWeekly = $carbonInstanceWeekly->format('F d, Y'); // Output: 'July 31, 2023'

                $eventPlayedDateWeekly = $formattedDateWeekly . ', ' . $timeWeekly;
                $WeeklyResult = EventResult::where('event_id', $eventIdWeekly)
                    ->where('event_time', $time24hoursWeekly)
                    ->where('current_date', $eventNewDateWeekly)
                    ->first();

                if (!empty($WeeklyResult) && isset($WeeklyResult->result) && $WeeklyResult->result < 10) {
                    $num_padded = sprintf("%02d", $WeeklyResult->result);
                    $finalResultWeekly = $num_padded;
                } elseif (!empty($WeeklyResult) && isset($WeeklyResult->result)) {
                    $finalResultWeekly = $WeeklyResult->result;
                } else {
                    $finalResultWeekly = '';
                }

                $firstDigitWeekly = '';
                $scndDigitWeekly = '';
                if (!empty($finalResultWeekly)) {
                    $digits1Weekly = str_split($finalResultWeekly);
                    $firstDigitWeekly = intval($digits1Weekly[0]);
                    $scndDigitWeekly = intval($digits1Weekly[1]);
                }
            }


            $eventsDataWeekly[] = [
                'event_idWeekly' => $eventWeekly->id,
                'event_nameWeekly' => $eventWeekly->name,
                'event_dateWeekly' => $eventPlayedDateWeekly,
                'resultWeekly' => $finalResultWeekly,
                'firstDigitWeekly' => $firstDigitWeekly,
                'scndDigitWeekly' => $scndDigitWeekly,
            ];
        }

        //endweekly

        //Monthly
        $uniqueEventIdsMonthly = [];
        foreach ($resultMonthly as $key => $value) {
            $eventIdMonthly = $value->event_id;
            $uniqueEventIdsMonthly[] = $eventIdMonthly;
        }

        $uniqueEventIdsMonthly = array_unique($uniqueEventIdsMonthly);
        $eventsDataMonthly = [];

        foreach ($uniqueEventIdsMonthly as $eventIdMonthly) {
            $eventMonthly = events::find($eventIdMonthly);
            $eventIdMonthly = $eventMonthly->id;
            $eventDateMonthly = $eventMonthly->event_date;

            // Parse the date string into a Carbon instance
            $event_dateMonthly = Carbon::parse($eventDateMonthly);
            $timeMonthly = $event_dateMonthly->format('h:i A'); // Output: '10:00 AM'
            $fullHrsTimeMonthly = $event_dateMonthly->format('h:i:s'); // Output: '10:00:00'

            $time24hoursMonthly = $event_dateMonthly->toTimeString(); // Output: '16:00:00'

            $eventDataMainMonthly = MainNumbers::where('event_id', $eventIdMonthly)->get();
            $eventDataInnerMonthly = inner::where('event_id', $eventIdMonthly)->get();
            $eventDataOuterMonthly = outer::where('event_id', $eventIdMonthly)->get();

            $eventDataMonthly = $eventDataMainMonthly->concat($eventDataInnerMonthly)->concat($eventDataOuterMonthly);

            foreach ($eventDataMonthly as $key => $value) {
                $eventNewDateMonthly = $value->current_date;
                // Parse the date string into a Carbon instance
                $carbonInstanceMonthly = Carbon::parse($eventNewDateMonthly);
                // Format the date in the desired format
                $formattedDateMonthly = $carbonInstanceMonthly->format('F d, Y'); // Output: 'July 31, 2023'

                $eventPlayedDateMonthly = $formattedDateMonthly . ', ' . $timeMonthly;
                $MonthlyResult = EventResult::where('event_id', $eventIdMonthly)
                    ->where('event_time', $time24hoursMonthly)
                    ->where('current_date', $eventNewDateMonthly)
                    ->first();

                if (!empty($MonthlyResult) && isset($MonthlyResult->result) && $MonthlyResult->result < 10) {
                    $num_padded = sprintf("%02d", $MonthlyResult->result);
                    $finalResultMonthly = $num_padded;
                } elseif (!empty($MonthlyResult) && isset($MonthlyResult->result)) {
                    $finalResultMonthly = $MonthlyResult->result;
                } else {
                    $finalResultMonthly = '';
                }

                $firstDigitMonthly = '';
                $scndDigitMonthly = '';
                if (!empty($finalResultMonthly)) {
                    $digits1Monthly = str_split($finalResultMonthly);
                    $firstDigitMonthly = intval($digits1Monthly[0]);
                    $scndDigitMonthly = intval($digits1Monthly[1]);
                }

            }

            $eventsDataMonthly[] = [
                'event_idMonthly' => $eventMonthly->id,
                'event_nameMonthly' => $eventMonthly->name,
                'event_dateMonthly' => $eventPlayedDateMonthly,
                'resultMonthly' => $finalResultMonthly,
                'firstDigitMonthly' => $firstDigitMonthly,
                'scndDigitMonthly' => $scndDigitMonthly,
            ];
        }
        //endMonthly

        $responseData = [
            'events' => $eventsData,
            'eventsWeekly' => $eventsDataWeekly,
            'eventsMonthly' => $eventsDataMonthly,
            'mainToday' => $mainToday,
            'innerToday' => $innerToday,
            'outerToday' => $outerToday,
        ];

        return response()->json($responseData);
    }

    public function getEventData(Request $request)
    {
        $user = auth('sanctum')->user();
        $userId = auth('sanctum')->user()->id;
        $currentDate = Carbon::now()->format('Y-m-d');
        $eventId = $request->eventid;
        $startOfWeek = Carbon::now()->startOfWeek()->format('Y-m-d');
        $endOfWeek = Carbon::now()->endOfWeek()->format('Y-m-d');

        $mainToday = MainNumbers::whereDate('created_at', $currentDate)
            ->where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('payment_status', '1')
            ->get();

        foreach ($mainToday as $key => $value) {
            $number = $value->number;
            if ($number < 10) {
                $num_padded = sprintf("%02d", $number);
                $value->number = $num_padded;
            } else {
                $value->number = $value->number;
            }
        }

        $mainWeekly = MainNumbers::where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('payment_status', '1')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->get();

        foreach ($mainWeekly as $key => $value) {
            $numberWeekly = $value->number;
            if ($numberWeekly < 10) {
                $num_paddedWeekly = sprintf("%02d", $numberWeekly);
                $value->number = $num_paddedWeekly;
            } else {
                $value->number = $value->number;
            }
        }

        $mainMonthly = MainNumbers::where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('payment_status', '1')
            ->whereMonth('created_at', Carbon::now()->month)
            ->get();

        foreach ($mainMonthly as $key => $value) {
            $numberMonthly = $value->number;
            if ($numberMonthly < 10) {
                $num_paddedMonthly = sprintf("%02d", $numberMonthly);
                $value->number = $num_paddedMonthly;
            } else {
                $value->number = $value->number;
            }
        }


        $innerToday = inner::whereDate('created_at', $currentDate)
            ->where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('payment_status', '1')
            ->get();
        $innerWeekly = inner::where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('payment_status', '1')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->get();
        $innerMonthly = inner::where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('payment_status', '1')
            ->whereMonth('created_at', Carbon::now()->month)
            ->get();

        $outerToday = outer::whereDate('created_at', $currentDate)
            ->where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('payment_status', '1')
            ->get();
        $outerWeekly = outer::where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('payment_status', '1')
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->get();
        $outerMonthly = outer::where('userId', $userId)
            ->where('event_id', $eventId)
            ->where('payment_status', '1')
            ->whereMonth('created_at', Carbon::now()->month)
            ->get();

        return response()->json([
            'status' => 200,
            'mainToday' => $mainToday,
            'innerToday' => $innerToday,
            'outerToday' => $outerToday,
            'mainWeekly' => $mainWeekly,
            'innerWeekly' => $innerWeekly,
            'outerWeekly' => $outerWeekly,
            'mainMonthly' => $mainMonthly,
            'innerMonthly' => $innerMonthly,
            'outerMonthly' => $outerMonthly,
        ]);

    }

    public function fetchMainNumber(Request $request)
    {
        $eventid = $request->eventid;
        $mainNumbers = MainNumbers::join('users', 'main_numbers.userId', '=', 'users.id')
            ->where('event_id', $eventid)
            ->select('main_numbers.*', 'users.name as user_name')
            ->get();

        return response()->json([
            'status' => 200,
            'main' => $mainNumbers,
        ]);
    }

    public function fetchNumbers(Request $request)
    {
        $eventid = $request->eventid;
        $currentDate = Carbon::now()->format('Y-m-d');
        // $mainNumbers = MainNumbers::join('users', 'main_numbers.userId', '=', 'users.id')
        //     ->where('event_id', $eventid)
        //     ->select('main_numbers.*', 'users.name as user_name')
        //     ->get();

        $mainNumbers = MainNumbers::select('number')
            ->where('event_id', $eventid)
            ->where('current_date', $currentDate)
            ->selectRaw('SUM(prize) as total_price')
            ->groupBy('number')
            ->orderByDesc('total_price')
            ->get();

        $ander = inner::select('number')
            ->where('event_id', $eventid)
            ->where('current_date', $currentDate)
            ->selectRaw('SUM(price) as total_price')
            ->groupBy('number')
            ->orderByDesc('total_price')
            ->get();

        $bahar = outer::select('number')
            ->where('event_id', $eventid)
            ->where('current_date', $currentDate)
            ->selectRaw('SUM(price) as total_price')
            ->groupBy('number')
            ->orderByDesc('total_price')
            ->get();

        // echo "<pre>";
        // print_r($mainNumbers);

        return response()->json([
            'status' => 200,
            'main' => $mainNumbers,
            'ander' => $ander,
            'bahar' => $bahar,
        ]);
    }

    public function finalNumber(Request $request)
    {
        $eventId = $request->eventid;
        $currentTime = $request->currentTime;
        $eventsTime = $request->eventsTime;
        $currentDate = Carbon::now()->format('Y-m-d');

        $event_result_num = EventResult::where('event_id', $eventId)
            ->where('event_time', $eventsTime)
            ->where('current_date', $currentDate)
            ->first();

        return response()->json([
            'status' => 200,
            'event_result_num' => $event_result_num,
        ]);

    }


}