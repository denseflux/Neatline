<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * JSON fixture generators.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_Json extends Neatline_TestCase
{


    protected $_isAdminTest = false;


    /**
     * Create exhibit, set parameter on request.
     */
    public function setUp()
    {

        parent::setUp();

        // Create exhibit.
        $this->exhibit = $this->__exhibit();
        $this->request->setQuery(array(
          'exhibit_id' => $this->exhibit->id
        ));

    }


    /**
     * GET /exhibits/:id
     * `exhibit.json`
     */
    public function testExhibit()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles    = '1';
        $exhibit->map_focus = '2';
        $exhibit->map_zoom  = '3';
        $exhibit->save();

        $this->writeFixtureFromRoute('neatline/exhibits/'.$exhibit->id,
            'exhibit.json');

    }


    /**
     * GET /records
     * `records.vector.standard.json`
     * `records.vector.changed.json`
     */
    public function testRecordsVector()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record3->title     = 'title3';
        $record1->body      = 'body1';
        $record2->body      = 'body2';
        $record3->body      = 'body3';
        $record1->coverage  = 'POINT(1 2)';
        $record2->coverage  = 'POINT(3 4)';
        $record3->coverage  = 'POINT(5 6)';

        $record1->__save();
        $record2->__save();
        $record3->__save();

        $this->writeFixtureFromRoute('neatline/records',
            'records.vector.standard.json');

        // - Record 2 coverage changes.
        // - Record 3 deleted.

        $record2->coverage = 'POINT(7 8)';
        $record2->__save();
        $record3->delete();

        $this->resetResponse();
        $this->writeFixtureFromRoute('neatline/records',
            'records.vector.changed.json');

    }


    /**
     * GET /records/:id
     * `records.list.json`
     */
    public function testRecordsList()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);

        $record1->title = 'title';
        $record2->title = '<tag>title with tags</tag>';
        $record3->title = null;
        $record1->body  = 'body';
        $record2->body  = '<tag>body with tags</tag>';
        $record3->body  = null;

        $record1->save();
        $record2->save();
        $record3->save();

        $this->writeFixtureFromRoute('neatline/records',
            'records.list.json');

    }


    /**
     * GET /records
     * `records.pagination.1-2.json`
     * `records.pagination.2-3.json`
     * `records.pagination.3-4.json`
     * `records.pagination.5-6.json`
     * `records.pagination.6.json`
     */
    public function testRecordsPagination()
    {

        for ($i = 0; $i<6; $i++) {
            $record = new NeatlineRecord($this->exhibit);
            $record->added  = '200'.$i.'-01-01';
            $record->title  = 'Record'.$i;
            $record->__save();
        }

        // Records 1-2.
        $this->request->setQuery(array('limit' => 2, 'offset' => 0));
        $this->writeFixtureFromRoute('neatline/records',
            'records.pagination.1-2.json');

        // Records 2-3.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 1));
        $this->writeFixtureFromRoute('neatline/records',
            'records.pagination.2-3.json');

        // Records 3-4.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 2));
        $this->writeFixtureFromRoute('neatline/records',
            'records.pagination.3-4.json');

        // Records 5-6.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 4));
        $this->writeFixtureFromRoute('neatline/records',
            'records.pagination.5-6.json');

        // Record 6.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 5));
        $this->writeFixtureFromRoute('neatline/records',
            'records.pagination.6.json');

    }


    /**
     * GET /records/:id
     * `record.standard.json`
     */
    public function testRecord()
    {

        $record = $this->__record($this->exhibit);

        $record->item_id            = 1;
        $record->title              = 'title';
        $record->body               = 'body';
        $record->tags               = 'tags';
        $record->coverage           = 'POINT(1 2)';
        $record->widgets            = 'Widget1,Widget3';
        $record->presenter          = 'Presenter2';
        $record->fill_color         = '#111111';
        $record->select_color       = '#222222';
        $record->stroke_color       = '#333333';
        $record->fill_opacity       = 4;
        $record->select_opacity     = 5;
        $record->stroke_opacity     = 6;
        $record->stroke_width       = 7;
        $record->point_radius       = 8;
        $record->weight             = 9;
        $record->start_date         = '10';
        $record->end_date           = '11';
        $record->point_image        = '12';
        $record->wms_address        = '13';
        $record->wms_layers         = '14';
        $record->min_zoom           = 15;
        $record->max_zoom           = 16;
        $record->show_after_date    = '17';
        $record->show_before_date   = '18';
        $record->map_focus          = '100,200';
        $record->map_zoom           = 10;
        $record->__save();

        $this->writeFixtureFromRoute('neatline/records/'.$record->id,
            'record.standard.json');

    }


    /**
     * POST /records
     * `record.add.json`
     */
    public function testRecordAdd()
    {

        $exhibit = $this->__exhibit();

        // New record data.
        $this->request->setMethod('POST')->setRawBody(
          Zend_Json::encode(array(
            'exhibit_id'    => $exhibit->id,
            'coverage'      => 'POINT(1 1)'
        )));

        $this->request->setMethod('POST');
        $this->writeFixtureFromRoute('neatline/records',
            'record.add.json');

    }


}
