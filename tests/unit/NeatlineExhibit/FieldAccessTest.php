<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Field set/get tests for `NeatlineExhibit`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_FieldAccess
    extends Neatline_Test_AppTestCase
{


    /**
     * Test field set/get.
     */
    public function testFieldAccess()
    {

        $exhibit = new NeatlineExhibit();

        $exhibit->layers        = '1';
        $exhibit->default_layer = '2';
        $exhibit->title         = '3';
        $exhibit->slug          = '4';
        $exhibit->description   = '5';
        $exhibit->public        = 6;
        $exhibit->styles        = '7';
        $exhibit->map_focus     = '8';
        $exhibit->map_zoom      = 9;
        $exhibit->save();

        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        $this->assertEquals($exhibit->layers,           '1');
        $this->assertEquals($exhibit->default_layer,    '2');
        $this->assertEquals($exhibit->title,            '3');
        $this->assertEquals($exhibit->slug,             '4');
        $this->assertEquals($exhibit->description,      '5');
        $this->assertEquals($exhibit->public,           6);
        $this->assertEquals($exhibit->styles,           '7');
        $this->assertEquals($exhibit->map_focus,        '8');
        $this->assertEquals($exhibit->map_zoom,         9);

    }


}
