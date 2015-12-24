<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('states', 'StateController@index');
Route::get('contacts/activate/{id}/{action}','ContactController@activate');
Route::get('pdf', 'ContactController@invoice');

//Route::get('contacts/exportExcel/','ContactController@exportExcel');
//Route::resource('contacts','ContactController', array('only' => array('index','update','store','destroy')));
//Route::resource('contacts', 'ContactController');
Route::get('contacts', [
    'uses' => 'ContactLaraController@index'
]);
Route::post('contacts', [
    'uses' => 'ContactLaraController@store'
]);
Route::put('contacts/{id}', [
    'uses' => 'ContactLaraController@update'
]);
Route::delete('contacts/{id}', [
    'uses' => 'ContactLaraController@destroy'
]);
Route::post('photo', 'PhotoController@upload');