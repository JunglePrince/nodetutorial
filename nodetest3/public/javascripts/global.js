
// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the table on initial page load
  populateTable();

  // Add Data button click
  $('#btnAddData').on('click', addData);

  // Delete Data link click
  $('#dataList table tbody').on('click', 'td a.linkdeletedata', deleteData);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/data/list', function(data) {

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td>' + this.userId + '</td>';
      tableContent += '<td>' + this.type + '</td>';
      tableContent += '<td>' + this.data + '</td>';
      tableContent += '<td><a href="#" class="linkdeletedata" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#dataList table tbody').html(tableContent);
  });
};

// Add Data
function addData(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addData input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all data info into one object
    var newData = {
      'userId': $('#addData fieldset input#inputUserId').val(),
      'type': $('#addData fieldset input#inputType').val(),
      'data': $('#addData fieldset input#inputData').val(),
    }

    // Use AJAX to post the object to our addData service
    $.ajax({
      type: 'POST',
      data: newData,
      url: '/data/add',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

          // Clear the form inputs
          $('#addData fieldset input').val('');

          // Update the table
          populateTable();

      }
      else {

          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);

      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Delete Data
function deleteData(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this data?');

  // Check and make sure the user confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/data/delete/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }
};