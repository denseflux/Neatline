<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getTagByName()` on NeatlineTagTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTableTest_GetTagByName
    extends Neatline_Test_AppTestCase
{


    /**
     * getTagByName() should return the tag with the passed name in the
     * passed exhibit.
     *
     * @group tags
     */
    public function testGetExhibitTag()
    {

        // Create exhibits.
        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();

        // Create tags.
        $tag1 = $this->__tag($exhibit1, 'tag');
        $tag2 = $this->__tag($exhibit2, 'tag');

        // Get tags by name.
        $retrieved1 = $this->_tagsTable->getTagByName($exhibit1, 'tag');
        $retrieved2 = $this->_tagsTable->getTagByName($exhibit2, 'tag');
        $this->assertEquals($retrieved1->id, $tag1->id);
        $this->assertEquals($retrieved2->id, $tag2->id);

    }


}
