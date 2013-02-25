
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Map', { startWithParent: false,
  define: function(Map, Editor, Backbone, Marionette, $, _) {


  /**
   * Start map edit when a record form is opened.
   *
   * @param {Object} model: The record model.
   */
  var startEdit = function(model) {
    Map.__view.startEdit(model);
  };

  Neatline.commands.addHandler('editor:map:startEdit', startEdit);


  /**
   * End map edit when a record form is closed.
   *
   * @param {Object} model: The record model.
   */
  var endEdit = function(model) {
    Map.__view.endEdit();
  };

  Neatline.commands.addHandler('editor:map:endEdit', endEdit);


  /**
   * Update the map edit controls.
   *
   * @param {Object} settings: The new form settings.
   */
  var updateEdit = function(settings) {
    Map.__view.updateEdit(settings);
  };

  Neatline.commands.addHandler('editor:map:updateEdit', updateEdit);


  /**
   * Update the WKT on the geometry handler.
   *
   * @param {String} wkt: The WKT.
   */
  var updateWKT = function(wkt) {
    Map.__view.updateWKT(wkt);
  };

  Neatline.commands.addHandler('editor:map:updateWKT', updateWKT);


  /**
   * Update edit layer styles.
   *
   * @param {Object} model: The updated model.
   */
  var updateStyles = function(model) {
    Map.__view.updateStyles(model);
  };

  Neatline.commands.addHandler('editor:map:updateStyles', updateStyles);


  /**
   * Update edit layer model.
   *
   * @param {Object} model: The updated model.
   */
  var updateModel = function(model) {
    Map.__view.updateModel(model);
  };

  Neatline.commands.addHandler('editor:map:updateModel', updateModel);


  /**
   * Delete all features on the edit layer.
   */
  var clear = function() {
    Map.__view.clear();
  };

  Neatline.commands.addHandler('editor:map:clear', clear);


  /**
   * Remove a model's layer from the map.
   *
   * @param {Object} model: The record model.
   */
  var deleteLayer = function(model) {
    Map.__collection.remove(model);
    Map.__view.removeLayerByModel(model);
  };

  Neatline.commands.addHandler('editor:map:deleteLayer', deleteLayer);


}});