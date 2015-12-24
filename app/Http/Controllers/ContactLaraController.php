<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 21/12/15
 * Time: 20:59
 */

namespace App\Http\Controllers;
use App\Http\Controllers\BaseController;
use App\Contact;
use Illuminate\Http\Request;
class ContactLaraController extends BaseController {
    public function __construct(Request $request, Contact $model){
        $this->_model = $model;
        parent::__construct($request);
    }
}