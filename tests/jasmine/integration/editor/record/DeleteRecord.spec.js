
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Delete Record', function() {


  var elements, fixtures = {
    record: read('EditorRecord.record.json'),
    empty:  read('EditorRecordDeleteRecord.json')
  };


  beforeEach(function() {

    NL.loadEditor();
    NL.showRecordForm(fixtures.record);

    elements = {
      delete1:  NL.v.record.$('a[href="#delete-modal"]'),
      delete2:  NL.v.record.deleteModal.find('a[name="delete"]'),
      cancel:   NL.v.record.deleteModal.find('a[name="cancel"]')
    };

  });


  it('should show modal when "Delete" is clicked', function() {

    // ------------------------------------------------------------------------
    // When the "Delete" button is clicked, the confirmation modal should be
    // displayed.
    // ------------------------------------------------------------------------

    // Click on "Delete".
    elements.delete1.trigger('click');

    // Modal and overlay should be visible.
    expect($('body')).toContain('div.modal-backdrop.in');
    expect(NL.v.record.deleteModal).toHaveClass('in');

  });


  it('should close modal when "Cancel" is clicked', function() {

    // ------------------------------------------------------------------------
    // When the "Cancel" button is clicked, the modal should disappear and the
    // form should return to its normal state.
    // ------------------------------------------------------------------------

    // Click on "Delete".
    elements.delete1.trigger('click');

    // Click on "Cancel".
    elements.cancel.trigger('click');

    // Modal should be closed.
    expect(NL.v.record.deleteModal).not.toHaveClass('in');

  });


  it('should close modal when the route changes', function() {

    // ------------------------------------------------------------------------
    // If the modal is displayed and the user navigates to a different route
    // (eg, click the back button), the modal should close.
    // ------------------------------------------------------------------------

    // Click on "Delete".
    elements.delete1.trigger('click');

    // Navigate back to browse.
    NL.navigate('records');

    // Modal should be hidden.
    expect(NL.v.record.deleteModal).not.toHaveClass('in');

  });


  it('should issue DELETE request when "Delete" is clicked', function() {

    // ------------------------------------------------------------------------
    // When the "Yes, delete" button is clicked, a well-formed DELETE request
    // should be issued to the records API.
    // ------------------------------------------------------------------------

    var id = NL.v.record.model.id;

    // Delete, confirm.
    elements.delete1.trigger('click');
    elements.delete2.trigger('click');

    // Route should be /records/:id, method DELETE.
    NL.assertLastRequestRoute(Neatline.g.neatline.records_api+'/'+id);
    NL.assertLastRequestMethod('DELETE');

  });


  it('should flash notification when the delete succeeds', function() {

    // ------------------------------------------------------------------------
    // When the "Yes, Delete" button is clicked and the request succeeds, a
    // success notification should be displayed.
    // ------------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'info');

    // Click on "Save".
    elements.delete2.trigger('click');
    NL.respondLast200(fixtures.empty);

    // Should flash success.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.record.remove.success
    );

  });


  it('should flash notification when the delete fails', function() {

    // ------------------------------------------------------------------------
    // When the "Yes, Delete" button is clicked and the request fails, a
    // failure notification should be displayed.
    // ------------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'error');

    // Click on "Save".
    elements.delete2.trigger('click');
    NL.respondLast500();

    // Should flash error.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.record.remove.error
    );

  });


  it('should close modal and form when delete succeeds', function() {

    // ------------------------------------------------------------------------
    // When the "Yes, delete" button is clicked and the request succeeds, the
    // modal should disappear and the form should close.
    // ------------------------------------------------------------------------

    // Delete, confirm.
    elements.delete1.trigger('click');
    elements.delete2.trigger('click');
    NL.respondLast200(fixtures.empty);

    // Modal should be hidden.
    expect(NL.v.record.deleteModal).not.toHaveClass('in');

    // Form should be closed.
    expect(NL.v.editor.__ui.editor).not.toContain(NL.v.record.$el);
    expect(NL.v.editor.__ui.editor).toContain(NL.v.records.$el);

    // Records list should be displayed.
    expect(Backbone.history.fragment).toEqual('records');

  });


  it('should refresh the exhibit when delete succeeds', function() {

    // ------------------------------------------------------------------------
    // When the "Yes, delete" button is clicked and the request succeeds, the
    // exhibit should be refreshed to manifest the deletion.
    // ------------------------------------------------------------------------

    var vent = NL.getEventSpy();

    // Delete, confirm.
    elements.delete1.trigger('click');
    elements.delete2.trigger('click');
    NL.respondLast200(fixtures.empty);

    // Should refresh the exhibit.
    expect(vent).toHaveBeenCalledWith('refresh', {
      source: 'EDITOR:RECORD'
    });

  });


});
