<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class State extends Base {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'state';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['name', 'abbreviation', 'country', 'type'];

}
