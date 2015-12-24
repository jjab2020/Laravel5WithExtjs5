<?php
namespace App\Http\Controllers;

use App\Contact;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class PhotoController extends Controller {

	public function upload(Request $request) {
		$file = array('photo' => $request->file('photo'));
		$rules = array('photo' => 'required', );
		$validator = \Validator::make($file, $rules);
		if ($validator -> fails()) {
			return \Response::json(array('success'=>false));
		} else {
			// checking file is valid.
			if (\Request::file('photo') -> isValid()) {
				$destinationPath = 'resources/images/userpics';
				// upload path
				$extension = \Request::file('photo') -> getClientOriginalExtension();
				// getting image extension
				$fileName = rand(11111, 99999) . '.' . $extension;
				// renameing image
				\Request::file('photo') -> move($destinationPath, $fileName);

				//updateing Contact record in database //Decided not to do this here. Will send back the filename
				//and update the record on client side and then send back to save. This way the picture gets updated
				//on form without having to reoad the whole store.
				// $contact = Contact::find($request->get('contact_id'));
				// $contact->picturefile = $fileName;
				// $contact->save();
				
				return \Response::json(array('success'=>true, 'filename' => $fileName));
			} else {
				return \Response::json(array('success'=>false));
			}
		}
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index() {
		// return \Response::json(array('success'=>true, 'states'=> State::get()));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create() {
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store() {
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id) {
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id) {
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id) {
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id) {
		//
	}

}
