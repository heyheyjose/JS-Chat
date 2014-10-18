/* grabbing the templates */
var template = _.template($('.chat-output-template').html());
var userTemplate = _.template($('.user-sidebar-template').html());

/* assigning the heroku server API to the apiUrl variable */
var apiUrl = "http://tiny-pizza-server.herokuapp.com/collections/JS-Chat";
var formObject = {}; // creating an empty object

var button = document.getElementById('button');

button.onclick = function() {
  var div = document.getElementById('login-wrapper');
  if (div.style.display !== 'none') {
    div.style.display = 'none';
  } else {
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
  }).done(function (data) {
    $('input.field').val('');
  });
});

var previousCount = 0;

setInterval(function () {
  $.ajax( {url: apiUrl} ).done(function (chatMessages) {
    if(chatMessages.length > previousCount) {
      previousCount = chatMessages.length;

      var finishedTemplates = _.map(chatMessages, function (message) {
        return template(message);
      });

      $('.chat-output').html(finishedTemplates);
    }
  });
}, 1000);

setInterval(function () {
  $.ajax( {url: apiUrl} ).done(function (chatUsers) {
    if(chatUsers.length > previousCount) {
      previousCount = chatUsers.length;

      var userTemplateFinished = _.map(chatUsers, function (person) {
        return userTemplate(person);
      });

      $('.user-sidebar').html(userTemplateFinished);
    }
  });
}, 1000);











