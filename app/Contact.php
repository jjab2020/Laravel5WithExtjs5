<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Contact extends Base {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'contact';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	//protected $fillable = ['last_name', 'first_name', 'address1', 'address2', 'city', 'state', 'zip', 'home_phone', 'work_phone', 'dob', 'email', 'password', 'dob', 'filename'];

	public static function baseQuery()
	{
		$query = self::select(array(
			'*'
		));
		return $query;
	}


}
