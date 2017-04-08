var clientUrl = "http://parse.sfm6.hackreactor.com/chatterbox/classes/messages";

var messagesArr = [];
var roomsArray = [];
var userName = window.location.search.substring(window.location.search.indexOf('=') + 1, window.location.search.length);


var App = function() {
  this.server = clientUrl;
  this.currentUser = userName;
  this.currentRoom;
};

App.prototype.init = function() {
  this.fetch();

};



App.prototype.hasEscape = function(message) {
  var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);

  if (pattern.test(message.username) || pattern.test(message.text) || pattern.test(message.roomname)) {
    console.log("hello")
    return true;
  } else {
    return false;
  }
}

App.prototype.fetch = function() {
  var context = this;

  $.ajax({
    url: context.server,
    type: "GET",
    success: function(data) {
      console.log('Data fetched');

      context.clearDOMMessages();

      data.results.forEach(function(message) {
        if (!context.hasEscape(message)) {
          messagesArr.push(message);
        }
      })
      // console.log(messagesArr)
      messagesArr.forEach(function(message) {
        context.renderMessage(message);
      })

      // console.log(messagesArr)
      context.populateRoomsList();


    },
    error: function(data) {
      console.log('failed to fetch data', data);
    }
  });
};


App.prototype.send = function(message) {
  console.log(message)

  var context = this;
  $.ajax({
    url: clientUrl,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log(data)
      console.log('chatterbox: Message sent');
      context.fetch();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.clearDOMMessages = function() {
  // console.log("This is the clear messages")
  messagesArr = [];
  console.log('messages cleared');
  // console.log(messagesArr)
  $('#chats').html('');
}

App.prototype.renderMessage = function(message) {
  var node = document.createElement('div');

  var username = document.createElement('div');
  username.setAttribute('class', 'username');
  username.append(document.createTextNode(message.username));
  node.appendChild(username);

  var text = document.createElement('div');
  text.setAttribute('class', 'text');
  text.append(document.createTextNode(message.text));
  node.appendChild(text);

  var roomname = document.createElement('div');
  roomname.setAttribute('class', 'roomname');
  roomname.append(document.createTextNode(message.roomname));
  node.appendChild(roomname);

  var $chats = $('#chats');
  $chats.append(node);
}

App.prototype.renderRoom = function(roomText) {
  this.populateRoomsList();
}

App.prototype.filterMessages = function(key, value) {


  var filtered = [];


  messagesArr.forEach(function(message) {
    

    if (message[key] === value) {
            filtered.push(message);
    }
  });

  return filtered;
}

  
App.prototype.populateRoomsList = function() {

  // roomsArray = [];
  console.log(messagesArr)
  messagesArr.forEach(function(message) {
    
    if (!roomsArray.includes(message.roomname)) {
      roomsArray.push(message.roomname);
    }
  });

  if (this.currentRoom === undefined) {
    this.currentRoom = roomsArray[0];
  }

  roomsArray.forEach(function(roomname) {
    var roomAnchor = document.createElement('a');
    roomAnchor.setAttribute('class', roomname);
    roomAnchor.append(document.createTextNode(roomname));
    $('#roomSelect').append(roomAnchor);
  });
};

App.prototype.createMessage = function(username, text, roomname) {
  var message = {};

  message.username = username;
  message.text = text;
  message.roomname = roomname

  this.send(message);
  
}


var app = new App();

$(document).ready(function() {

  

  app.init();

  $('.createMessage').on("click", function(event) {
    var messageText = $(".newMessage").val();
    app.createMessage(app.currentUser, messageText, app.currentRoom);
  });

  $('#createRoom').on("click", function(event) {
    var roomText = $(".newRoom").val();
    roomsArray.push(roomText);
    app.clearDOMMessages();
    app.currentRoom = roomText;
    app.renderRoom(roomText);
  });

  $('#roomSelect').on("click", "a", function(event) {
    app.currentRoom = this.textContent.trim();
    console.log(app.currentRoom)
    // console.log("'" + this.context + "'");
    var filteredArr = app.filterMessages('roomname', app.currentRoom);
    app.clearDOMMessages();

    // console.log(app.currentRoom);

    filteredArr.forEach(function(message) {
      // console.log(message)
      app.renderMessage(message);
    })
    // console.log(filteredArr)
  })
});



