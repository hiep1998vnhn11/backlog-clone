<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SpentTimeController;
use App\Models\Activity;
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
    Route::post('register', [AuthController::class, 'register']);
});


Route::group(
    [
        'middelware' => 'auth',
    ],
    function () {
        Route::post('/upload-avatar', [AuthController::class, 'uploadAvatar']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/change-info', [AuthController::class, 'changeInfo']);
        Route::get('/project/{projectKey}/memberAndCategory', [ProjectController::class, 'memberAndCategory']);

        Route::get('/project/pluck', [ProjectController::class, 'pluck']);
        Route::get('/issue/{issue}/spents', [IssueController::class, 'spents']);

        Route::resource('account', AccountController::class)->middleware('role:admin');
        Route::get('/project/{project}/compact', [ProjectController::class, 'compact']);
        Route::resource('/project', ProjectController::class);
        Route::resource('/category', CategoryController::class);
        Route::resource('/issue', IssueController::class);
        Route::resource('/member', MemberController::class);
        Route::resource('/activity', ActivityController::class);
        Route::resource('/spent', SpentTimeController::class);
    }
);
