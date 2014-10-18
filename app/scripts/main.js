/* grabbing the templates */
var chatTemplate = _.template($('.chat-output-template').html());
var usersTemplate = _.template($('.user-sidebar-template').html());

/* assigning the heroku server API to the apiUrl variable */
var apiUrl = "http://tiny-pizza-server.herokuapp.com/collections/JS-Chat-New";
var msgObject = {}; // creating an empty object

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
$('.login-form input[type=submit]').on('click', function (event) {
  event.preventDefault();
  var loginValues = $('input.userName').serializeArray();
  loginValues.forEach(function (userName) {
    msgObject[userName.name] = userName.value;
  }); // end of user login

  $('input[type=submit]').on('click', function (event) {
    event.preventDefault();
    var fieldValues = $('input.field').serializeArray();
    fieldValues.forEach(function (field) {
      msgObject[field.name] = field.value;
    });

    console.log(msgObject);

    $.ajax({
      method: 'POST',
      url: apiUrl,
      data: msgObject
    }).done(function (data) {
      $('input.field').val('');
    });
  });

  var prevCount = 0;

  setInterval(function () {
    $.ajax( {url: apiUrl} ).done(function (chatMessages) {
      if(chatMessages.length > prevCount) {
        console.log(chatMessages);
        prevCount = chatMessages.length;

        var finishedTemplates = _.map(chatMessages, function (msg) {
          if (_.isUndefined(msg.message)) {
            msg.message = '';
          } if (_.isUndefined(msg.user)) {
            msg.user = '';
          } if (_.isUndefined(msg.picture)) {
            msg.picture = '';
          } if (_.isUndefined(msg.date)) {
            msg.date = '';
          }
          return chatTemplate(msg);
        });

        $('.chat-output').html(finishedTemplates);
      }
    });

    $.ajax( {url: apiUrl} ).done(function (chatUsers) {
      var userTemplateFinished = _.map(chatUsers, function (person) {
        if (_.isUndefined(person.user)) {
          person.user = '';
        }
        return usersTemplate(person);
      });

      $('.user-sidebar').html(userTemplateFinished);
    });
  }, 1000);
});
