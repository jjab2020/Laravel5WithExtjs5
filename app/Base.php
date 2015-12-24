<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 22/12/15
 * Time: 22:47
 */

namespace App;
use Illuminate\Database\Eloquent\Model;
class Base extends Model
{
    public static function baseQuery()
    {
        $query = self::select(array(
            '*'
        ));
        return $query;
    }
    public function filterByKey()
    {
        return $this->baseQuery()->where($this->getKeyName(), $this->getKey());
    }
}