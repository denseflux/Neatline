<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ImportItemsTest extends Neatline_TestCase
{


    /**
     * `Neatline_ImportItems` should apply the search query.
     */
    public function testCreateRecords()
    {

        $item1 = $this->__item();
        $item2 = $this->__item();

        $exhibit = $this->__exhibit();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_ImportItems', array(

                'web_dir'       => nl_getWebDir(),
                'exhibit_id'    => $exhibit->id,
                'query'         => array('range' => $item1->id)

            )
        );

        // Should match item 1, not item 2.
        $records = $this->__records->queryRecords($exhibit);
        $this->assertEquals($records['records'][0]['item_id'],$item1->id);
        $this->assertEquals($records['count'], 1);

    }


    /**
     * For any given Omeka item, `Neatline_ImportItems` should check to
     * see if a record already exists in the exhibit for the item; if so,
     * the record should be re-compiled, but not duplicated.
     */
    public function testRecompileRecords()
    {

        $item = $this->__item();

        $exhibit = $this->__exhibit();

        // Create existing item-backed record.
        $record = new NeatlineRecord($exhibit, $item);
        $record->__save();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_ImportItems', array(

                'web_dir'       => nl_getWebDir(),
                'exhibit_id'    => $exhibit->id,
                'query'         => array('range' => $item->id)

            )
        );

        // Should not duplicate the record.
        $records = $this->__records->queryRecords($exhibit);
        $this->assertEquals($records['count'], 1);

        // Should recompile the record.
        $this->assertNotNull($records['records'][0]['body']);

    }


    /**
     * When a new record is created for an item, the `added` field on the
     * record should be set to match the `added` field on the parent item.
     * This ensures that the records will be listed in the Neatline editor
     * in the same order as the parent items in the Omeka admin.
     */
    public function testSetRecordAdded()
    {

        $item = $this->__item();
        $item->added = '2000-01-01 00:00:00';
        $item->save();

        $exhibit = $this->__exhibit();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_ImportItems', array(

                'web_dir'       => nl_getWebDir(),
                'exhibit_id'    => $exhibit->id,
                'query'         => array('range' => $item->id)

            )
        );

        // Load the new record.
        $record = $this->__records->findBySql(
            'exhibit_id=?', array($exhibit->id), true
        );

        // Should set `added` to match item.
        $this->assertEquals($record->added, '2000-01-01 00:00:00');

    }


    /**
     * `Neatline_ImportItems` should manually update the `webDir` property
     * on the filesystem adapter.
     */
    public function testSetWebDir()
    {

        $item = $this->__item();

        $exhibit = $this->__exhibit();

        insert_files_for_item($item, 'Filesystem', array(
            NL_DIR . '/tests/phpunit/mocks/file.txt'
        ));

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_ImportItems', array(

                'web_dir'       => 'webDir',
                'exhibit_id'    => $exhibit->id,
                'query'         => array('range' => $item->id)

            )
        );

        // Load the new record.
        $record = $this->__records->findBySql(
            'exhibit_id=?', array($exhibit->id), true
        );

        // Parse `body` HTML.
        $doc = new DOMDocument();
        $doc->loadHTML($record->body);

        // Query for the file link.
        $xpath = new DOMXpath($doc);
        $anchor = $xpath->query('//a[@class="download-file"]')->item(0);

        // Link should start with 'webDir/'
        $this->assertEquals(
            substr($anchor->getAttribute('href'), 0, 7),
            'webDir/'
        );

    }


}
