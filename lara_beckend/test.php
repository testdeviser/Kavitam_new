<?php

// API URL endpoint
$apiUrl1 = 'https://kavitam.com/lara_beckend/public/api/todayActiveEventsLive';

// Initialize cURL session for the first request
$ch = curl_init();

// Set cURL options for the first request
curl_setopt($ch, CURLOPT_URL, $apiUrl1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// Execute the cURL session and get the response
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    echo 'cURL Error: ' . curl_error($ch);
}

// Close the cURL session
curl_close($ch);

// Process the response (e.g., display, decode JSON, etc.)
if ($response) {
    $responseData1 = json_decode($response, true); // Use true for associative array conversion

    // Check if event_id is present in the responseData1
    if (isset($responseData1['event_id'])) {
        // Extract event_id from responseData1
        $events = $responseData1['event_id'];
        $eventTime = $responseData1['time'];
        
        // API URL endpoint for the second request
        $apiUrl2 = "https://kavitam.com/lara_beckend/public/api/admin/Numbers/fetch/$events";

        // Initialize cURL session for the second request
        $ch2 = curl_init();

        // Set cURL options for the second request
        curl_setopt($ch2, CURLOPT_URL, $apiUrl2);
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, 1);

        // Execute the cURL session and get the response for the second request
        $response2 = curl_exec($ch2);

        // Check for cURL errors
        if (curl_errno($ch2)) {
            echo 'cURL Error: ' . curl_error($ch2);
        }

        // Close the cURL session for the second request
        curl_close($ch2);

        // Process the response from the second API call
        if ($response2) {
            $responseData2 = json_decode($response2, true); // Use true for associative array conversion
            
            // Check if the length of $responseData2 is greater than 0
            if (isset($responseData1['addHourTime']) && isset($responseData1['currentTime1']) && $responseData1['addHourTime'] === $responseData1['currentTime1'] ) {
                // API URL endpoint
                //$apiUrl = 'https://kavitam.com/lara_beckend/public/api/result';
                // $apiUrl = 'https://kavitam.com/lara_beckend/public/api/randNum/$events';
                
                $apiUrl = "https://kavitam.com/lara_beckend/public/api/randNum/$events";
                
                // Data to be sent to the API (if required)
                $data = [
                    'key1' => 'value1',
                    'key2' => 'value2',
                ];
                
                // Initialize cURL session
                $ch = curl_init();
                
                // Set cURL options
                curl_setopt($ch, CURLOPT_URL, $apiUrl);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                
                // If sending data via POST (uncomment the following lines if needed)
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                
                // Execute the cURL session and get the response
                $response3 = curl_exec($ch);
                
                // Check for cURL errors
                if (curl_errno($ch)) {
                    echo 'cURL Error: ' . curl_error($ch);
                }
                
                // Close the cURL session
                curl_close($ch);

                // Process the response (e.g., display, decode JSON, etc.)
                if ($response3) {
                    $responseData3 = json_decode($response3, true); // Use true for associative array conversion
                    //echo "<pre>";print_r($responseData3);die; // Display the API response
                    
                    $randNum = $responseData3['randomNumber'];

                    // Check if $responseData3 is not empty to proceed with the third request
                    if (!empty($responseData3)) {
                        // API URL endpoint for the third request
                        $apiUrl3 = "https://kavitam.com/lara_beckend/public/api/finalResult/$events/$randNum/$eventTime";
                        
                        //echo $apiUrl3;die;

                        // Data to be sent to the API (if required)
                        $data1 = [
                            'key1' => 'value1',
                            'key2' => 'value2',
                        ];

                        // Initialize cURL session for the third request
                        $ch3 = curl_init();

                        // Set cURL options for the third request
                        curl_setopt($ch3, CURLOPT_URL, $apiUrl3);
                        curl_setopt($ch3, CURLOPT_RETURNTRANSFER, 1);
                        curl_setopt($ch3, CURLOPT_POST, 1);
                        curl_setopt($ch3, CURLOPT_POSTFIELDS, $data1);

                        // Execute the cURL session and get the response
                        $response4 = curl_exec($ch3);

                        // Check for cURL errors
                        if (curl_errno($ch3)) {
                            echo 'cURL Error: ' . curl_error($ch3);
                        }

                        // Close the cURL session for the third request
                        curl_close($ch3);

                        // Process the response from the third API call
                        //if ($response4) {
                        //$responseData4 = json_decode($response4, true); // Use true for associative array conversion
                        //print_r($responseData4); // Display the API response from the third request
                        
                        // Add your logic here to process responseData4 if needed
                    
                        // Perform the updateResultToday API call
                        $updateResultToday = "https://kavitam.com/lara_beckend/public/api/update_Result_today/$events/$eventTime";
                        
                        // Data to be sent to the API (if required)
                        $dataUpdate = [
                            'key' => 'value',
                            // Add any other required data
                        ];
                        
                        // Initialize cURL session for the updateResultToday request
                        $chUpdate = curl_init();
                    
                        // Set cURL options for the updateResultToday request
                        curl_setopt($chUpdate, CURLOPT_URL, $updateResultToday);
                        curl_setopt($chUpdate, CURLOPT_RETURNTRANSFER, 1);
                        curl_setopt($chUpdate, CURLOPT_POST, 1);
                        curl_setopt($chUpdate, CURLOPT_POSTFIELDS, $dataUpdate);
                    
                        // Execute the cURL session and get the response
                        $updateResponse = curl_exec($chUpdate);
                    
                        // Check for cURL errors
                        if (curl_errno($chUpdate)) {
                            echo 'cURL Error: ' . curl_error($chUpdate);
                        }
                    
                        // Close the cURL session for the updateResultToday request
                        curl_close($chUpdate);
                    
                        // Process the response from the updateResultToday API call
                        if ($updateResponse) {
                            $updateData = json_decode($updateResponse, true); // Use true for associative array conversion
                            // Add your logic here to process updateData if needed
                        } else {
                            echo 'No response received from the updateResultToday API.';
                        }
                    // } else {
                    //     echo 'No response received from the third API.';
                    // }
                    }
                } else {
                    echo 'No response received from the API.';
                }
            } else {
                echo 'The length of $responseData2 is 0. Skipping the second API call.';
            }
        } else {
            echo 'No response received from the second API.';
        }
    } else {
        echo 'No event_id found in the API response.';
    }
} else {
    echo 'No response received from the first API.';
}

