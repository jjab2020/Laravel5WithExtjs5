<?php
namespace App\Http\Controllers;

use App\Contact;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Arabicdatetime;
use PDF;
use Excel;

class ContactController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        if(\Request::input('filter')){
            $filter = json_decode(\Request::input('filter'),true);
            for ($i = 0; $i < count($filter); $i++) {
                $field = $filter[$i]['property'];
                $value = $filter[$i]['value'];
                $operator = isset($filter[$i]['operator']) ? $filter[$i]['operator'] : null;
                $filterType = isset($filter[$i]['type']) ? $filter[$i]['type'] : null;
                switch ($filterType) {
                    case 'string' :
                        $contact=contact::where($field, $operator, "%$value%");
                        $count=contact::where($field, $operator, "%$value%")->count();
                        break;
        }
            }
            return \Response::json(array('success' => true, 'contacts' => $contact->get()));
        }
        else{
            return \Response::json(array('success' => true, 'contacts' => Contact::get()));
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $rules = array('last_name' => 'required', 'first_name' => 'required', 'email' => 'email');
        // $this->validate($request,$rules);
        $input = json_decode(\Request::input('contacts'));
        $validator = \Validator::make((array)$input, $rules);

        if ($validator->fails()) {
            return \Response::json(array('success' => false));
            //TODO add a reason for failure to json response using $validator->messages() or $validator->failed()
        } else {
            $contact = new Contact;
            $contact->first_name = $input->first_name;
            $contact->last_name = $input->last_name;
            $contact->email = isset($input->email) ? $input->email : null;
            $contact->address1 = isset($input->address1) ? $input->address1 : null;
            $contact->address2 = isset($input->address2) ? $input->address2 : null;
            $contact->city = isset($input->city) ? $input->city : null;
            $contact->state = isset($input->state) ? $input->state : null;
            $contact->zip = isset($input->zip) ? $input->zip : null;
            $contact->home_phone = isset($input->home_phone) ? $input->home_phone : null;
            $contact->work_phone = isset($input->work_phone) ? $input->work_phone : null;
            $contact->save();
        }

        return \Response::json(array('success' => true, 'contacts' => Contact::find($contact->id)));
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public function update($id)
    {
        $input = json_decode(\Request::input('contacts'));
        $contact = Contact::find($id);
        foreach ($input as $key => $value) {
            $contact[$key] = $value;
        }
        $contact->save();

        return \Response::json(array('success' => true, 'contacts' => $contact));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        Contact::destroy($id);

        return \Response::json(array('success' => true));
    }

    public function activate($id, $action)
    {
        //$car=json_decode($id);
        //if($car[0]->action=='delete'){
        $contact = Contact::whereId($id)->get()->first();
        if ($action == 'print') {

            if (count($contact) > 0) {
                $pdf = \App::make('dompdf.wrapper');
                $pdf->loadHTML('<h1>' . $contact->last_name .'('.$contact->id. ')</h1>');
                return $pdf->stream('invoice.pdf');
            }
        }


        //return $contact->last_name;

        //return Arabicdatetime::date(1418123530 , 1);

        else {

            return $this->exportExcel($id);

        }
    }
public function invoice() 
    {
        $data = $this->getData();
        $date = date('Y-m-d');
        $invoice = "2222";
        $view =  \View::make('pdf.invoice', compact('data', 'date', 'invoice'))->render();
        $pdf = \App::make('dompdf.wrapper');
        $pdf->loadHTML($view);
        return $pdf->stream('invoice');
    }

    public function getData() 
    {
        $data =  [
            'quantity'      => '1' ,
            'description'   => 'some ramdom text',
            'price'   => '500',
            'total'     => '500'
        ];
        return $data;
    }
    public function exportExcel($id)
    {

        $contact = Contact::whereId($id)->get();

        Excel::create('Filename', function($excel) use($contact){

            $excel->sheet('a1', function($sheet) use($contact){

                $sheet->fromArray($contact);

            });

        })->export('xls');

    }

}
