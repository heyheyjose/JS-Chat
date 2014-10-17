var template = _.template($('.chat-output-template').html());
var apiUrl = "http://tiny-pizza-server.herokuapp.com/collections/JS-Chat";
var formObject = {};

var button = document.getElementById('button');

button.onclick = function() {
  var div = document.getElementById('login-wrapper');
  if (div.style.display !== 'none') {
      div.style.display = 'none';
  }
  else {
    div.style.display = 'block';
    }
  };

/* user login*/
$('.login-form [type=submit]').on('click', function (event) {
  event.preventDefault();
  var loginValues = $('input.userName').serializeArray();

   loginValues.forEach(function (userName) {
    formObject[userName.name] = userName.value;
  });
});
/* end user login*/

$('input[type=submit]').on('click', function (event) {
  event.preventDefault();
  var fieldValues = $('input.field').serializeArray();

   fieldValues.forEach(function (field) {
    formObject[field.name] = field.value;
  });

//console.log(formObject);
  formObject.picture = ' ';
  formObject.date = ' ';

  $.ajax({
    method: 'POST',
    url: apiUrl,
    data: formObject
  }).done(function (data) { $('input.field').val(' '); });
});

var previousCount = 0;

setInterval(function () {
  $.ajax( {url: apiUrl} ).done(function (allTheMessages) {
    if(allTheMessages.length > previousCount) {
      previousCount = allTheMessages.length;

      var finishedTemplates = _.map(allTheMessages, function (message) {
        return template(message);
      });

      $('.chat-output').html(finishedTemplates);
    }
  });
}, 1000);
