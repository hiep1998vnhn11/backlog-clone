<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Middlewares\RoleMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
});

Route::post('/upload-avatar', [AuthController::class, 'uploadAvatar']);
Route::post('/change-password', [AuthController::class, 'changePassword']);
Route::post('/change-info', [AuthController::class, 'changeInfo']);

Route::group([
    'middelware' => 'auth:api',
], function () {
    Route::group([
        'middleware' => 'role:admin|agent'
    ], function () {
        Route::get('account/getAgentAndShipper', [AccountController::class, 'getAgentAndShipper']);
        Route::resource('account', AccountController::class);
        Route::resource('order', OrderController::class);
    });
});
