
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Map', { startWithParent: false,
  define: function(Map, Editor, Backbone, Marionette, $, _) {


  /**
   * Graft editing functionality onto the map when a form is opened.
   *
   * @param {Number} id: The record id.
   */
  var startEdit = function(id) {
    Map.__view.freeze(id);
    Neatline.request('editor:records:fetch', id, function(r) {
      Map.__view.startEdit(r);
    });
  };


  /**
   * Strip editing functionality off the map when a form is closed.
   *
   * @param {Object} model: The record model.
   */
  // Neatline.vent.on('editor:form:close', function(model) {
  //   Map.__view.unFreeze(model.get('id'));
  //   Map.__view.endEdit();
  // });


  /**
   * Updated editing settings when control inputs are changed on the form.
   *
   * @param {Object} settings: Settings hash.
   */
  // Neatline.vent.on('editor:form:updateMap', function(settings) {
  //   Map.__view.update(settings);
  // });


  /**
   * When a record is deleted, purge it from the collection and map.
   *
   * @param {Object} model: The deleted record.
   */
  // Neatline.vent.on('editor:form:delete', function(model) {
  //   Map.__collection.remove(model);
  //   Map.__view.removeLayerByModel(model);
  // });


  Neatline.vent.on('editor:router:#records/:id', startEdit);


}});
