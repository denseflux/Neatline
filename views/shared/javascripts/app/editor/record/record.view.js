
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.View = Backbone.Neatline.View.extend({


    template:   '#record-form-template',
    className:  'form-stacked record',
    tagName:    'form',

    events: {
      'click a[name="close"]':    'onCloseClick',
      'click a[name="save"]':     'onSaveClick',
      'click a[name="delete2"]':  'onDeleteClick'
    },

    ui: {
      text: {
        tab:    'a[href="#record-form-text"]',
        region: '#record-form-text'
      },
      remove: {
        modal:  '#delete-modal'
      }
    },


    /**
     * Initialize state, render template.
     */
    initialize: function() {
      this.open = false;    // True when the form is displayed.
      this.getTemplate();
      this.getUi();
      this.resetTabs();
    },


    /**
     * Show the form.
     *
     * @param {Object} model: A record model.
     */
    bind: function(model) {

      // Start map editing, bind model to form.
      Neatline.execute('MAPEDIT:startEdit', model);
      rivets.bind(this.$el, { record: model });

      // Update map on model change.
      model.bind('change', function() {
        Neatline.execute('MAPEDIT:updateModel', model);
      });

      // Notify tab views.
      Neatline.vent.trigger('RECORD:bind', model);

      this.model = model;
      this.open  = true;

    },


    /**
     * End the map edit session, reset the presenter.
     */
    unbind: function() {

      // Deactivate map editing.
      Neatline.execute('MAPEDIT:endEdit', this.model);

      // Activate and close the presenter.
      Neatline.vent.trigger('PRESENTER:activate');
      Neatline.execute('PRESENTER:unselect', this.model);

      this.model = null;
      this.open  = false;

    },


    /**
     * Close the form.
     */
    onCloseClick: function() {
      Neatline.execute('RECORDS:navToList');
      this.unbind();
    },


    /**
     * Save the record.
     */
    onSaveClick: function() {
      this.model.save(null, {
        success:  _.bind(this.onSaveSuccess, this),
        error:    _.bind(this.onSaveError, this)
      });
    },


    /**
     * Delete the record.
     */
    onDeleteClick: function() {
      this.model.destroy({
        success:  _.bind(this.onDeleteSuccess, this),
        error:    _.bind(this.onDeleteError, this)
      });
    },


    /**
     * When a save succeeds.
     */
    onSaveSuccess: function() {

      // Refresh the map.
      Neatline.execute('MAP:refresh');

      // Update the route.
      Neatline.execute('RECORD:updateRoute',
        'records/'+this.model.get('id')
      );

      // Flash success.
      Neatline.execute('EDITOR:notifySuccess',
        STRINGS.record.save.success
      );

    },


    /**
     * When a save fails.
     */
    onSaveError: function() {
      Neatline.execute('EDITOR:notifyError',
        STRINGS.record.save.error
      );
    },


    /**
     * When a delete succeeds.
     */
    onDeleteSuccess: function() {

      // Delete the record's layer on the map.
      Neatline.execute('MAPEDIT:deleteLayer', this.model);
      this.__ui.remove.modal.modal('hide');

      // FLash success.
      Neatline.execute('EDITOR:notifySuccess',
        STRINGS.record.remove.success
      );

      this.onCloseClick();

    },


    /**
     * When a delete fails.
     */
    onDeleteError: function() {
      Neatline.execute('EDITOR:notifyError',
        STRINGS.record.remove.error
      );
    },


    /**
     * Activate the "Text" tab.
     */
    resetTabs: function() {
      this.__ui.text.region.addClass('active');
      this.__ui.text.tab.tab('show');
    }


  });


});
