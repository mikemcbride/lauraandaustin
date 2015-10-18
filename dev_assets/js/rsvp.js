$(document).ready(function() {
  // initialize the Parse object
  Parse.initialize("esgwG6h6b8YLjQiri6Hm1srCP0xuVtxUKWVQcFpK", "OtnuwfSEMtOsfAVlpzKQVlhzUlv5ZKgNZ2H7eNS1");

  // for use later
  var guestsArray = [];

  $('#submit_code').click(function() {
    getGuests($('#rsvp_code').val());
    $('#code_group').hide();
  });

  $('#guest_info').on('click', '#submit_rsvp', function() {
    submitRsvpForm();
  });

  $('#guest_info').on('click', '.dismiss-alert', function() {
    $(this).parent().hide();
  });

  $('.dismiss-alert').click(function() {
    $(this).parent().hide();
  });


  /* Functions to build our data */
  function getGuests(code) {
    $('#loading_rsvp_data').show();
    var Reservation = Parse.Object.extend("Reservation");
    var query = new Parse.Query(Reservation);
    query.equalTo("rsvp_code", code);
    query.find({
      success: function(results) {
        $('#loading_rsvp_data').hide();
        if (results.length == 0) {
          $('#error_message').show();
          $('#code_group').show();
        } else {
          buildRsvpForm(results);
        }
      },
      error: function(error) {
        $('#loading_rsvp_data').hide();
        $('#error_message').show();
        $('#code_group').show();
      }
    });
  }

  function buildRsvpForm(data) {
    guestsArray = data;
    for (var i = 0; i < data.length; i++) {
      var object = data[i];
      var person = {
        "first_name": object.get('first_name'),
        "last_name": object.get('last_name'),
        "responded": object.get('responded'),
        "attending": object.get('attending'),
        "gets_guest": object.get('gets_guest'),
        "guest_name": object.get('guest_name'),
        "guest_attending": object.get('guest_attending'),
        "objectId": object.id
      };

      var html = '<h3 class="title">' + person.first_name + ' ' + person.last_name + '</h3>';

      if (person.responded == true) {
        html += '<div class="alert-box alert-info"><strong>Heads up!</strong> It looks like your RSVP has already been submitted. You can update your reservation if your response has changed, or if you feel like submitting it again.<span class="dismiss-alert"><i class="fa fa-times"></i></span></div>';
      }

      html +='<fieldset id="' + person.objectId + '" class="my-md">' +
                '<div class="radio">' +
                  '<label>' +
                    '<input type="radio" name="' + person.objectId + '_attendance" id="' + person.objectId + '_attendanceRadio1" value="true" checked>I wouldn\'t miss it!' +
                  '</label>' +
                '</div>' +
                '<div class="radio">' +
                  '<label>' +
                    '<input type="radio" name="' + person.objectId + '_attendance" id="' + person.objectId + '_attendanceRadio2" value="false">Unfortunately cannot make it' +
                  '</label>' +
                '</div>';

      if (person.gets_guest == true) {
        html += '<p>Will you be bringing a guest?</p>' +
                '<div class="radio">' +
                  '<label>' +
                    '<input type="radio" name="' + person.objectId + '_guest_attendance" id="' + person.objectId + '_guestAttendanceRadio1" value="true" checked>Yes, I am bringing a guest' +
                  '</label>' +
                '</div>' +
                '<div class="radio">' +
                  '<label>' +
                    '<input type="radio" name="' + person.objectId + '_guest_attendance" id="' + person.objectId + '_guestAttendanceRadio2" value="false">No, it will just be me' +
                  '</label>' +
                '</div>' +
                '<div class="form-group">' +
                  '<label>Guest name</label>' +
                  '<input type="text" id="' + person.objectId + '_guest_name" class="form-control" placeholder="First and last name">'
                '</div>';
      }

      html += '</fieldset>';

      $('#guest_info').append(html);
    }

    addSubmitButton();
  }

  function addSubmitButton() {
    $('#guest_info').append('<button class="btn" id="submit_rsvp">Submit</button>');
  }

  function submitRsvpForm() {
    $('#guest_info').hide();
    $('#loading_rsvp_data').show();
    var errorSubmitting = false;

    for (var i = 0; i < guestsArray.length; i++) {
      var obj = getValues(guestsArray[i]);

      var Reservation = Parse.Object.extend("Reservation");
      var res = new Reservation();
      res.id = obj.objectId;

      res.set("responded", obj.responded);
      res.set("attending", obj.attending);
      res.set("guest_attending", obj.guest_attending);
      res.set("guest_name", obj.guest_name);

      res.save(null, {
        success: function(res) {},
        error: function(res, error) {
          errorSubmitting = true;
        }
      });
    }

    $('#loading_rsvp_data').hide();

    if (errorSubmitting == true) {
      $('#error_submitting').show();
    } else {
      $('#success_message').show();
      $('#rsvp_code').val('');
      $('#code_group').show();
    }
  }

  function getValues(obj) {
    var person = {
      "first_name": obj.get('first_name'),
      "last_name": obj.get('last_name'),
      "responded": true,
      "gets_guest": obj.get('gets_guest'),
      "guest_name": '',
      "guest_attending": false,
      "objectId": obj.id
    };

    person.attending = $('input[name="' + person.objectId + '_attendance"]:checked').val() == "true" ? true : false;

    if (person.gets_guest == true) {
      person.guest_attending = $('input[name="' + person.objectId + '_guest_attendance"]:checked').val() == "true" ? true : false;
      person.guest_name = $('#' + person.objectId + '_guest_name').val();
    }

    return person;
  }

});
