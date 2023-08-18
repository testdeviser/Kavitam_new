<?php

namespace App\Http\Controllers\adminApi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Wallet;

class UserController extends Controller
{
    public function index()
    {
        $user_id = auth('sanctum')->user()->id;
        $data = User::where('id', $user_id)->first();
        if ($data) {
            return response()->json([
                'status' => 200,
                'user' => $data,
            ]);
        } else {
            return response()->json([
                'status' => 200,
                'message' => 'no record found!',
            ]);
        }
    }

    public function users(Request $request)
    {
        $users = User::all();
        if ($users) {
            return response()->json([
                'status' => 200,
                'users' => $users,
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'No Record Found!!',
            ]);
        }
    }

    public function deleteUser(Request $request, $id)
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found!!',
            ]);
        }

        // Delete the user
        $user->delete();
        return response()->json([
            'status' => 200,
            'message' => 'User deleted',
            'users' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            //'phone' => 'string|max:20',
            // Add other validation rules as needed
        ]);

        // Update the user's information
        $user->update($validatedData);

        return response()->json(['message' => 'User updated successfully']);
    }
}