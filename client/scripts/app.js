var clientUrl = "http://parse.sfm6.hackreactor.com/chatterbox/classes/messages";

var messagesArr = [];
var roomsArray = ['test'];

var message = {
  username: 'kvo',
  text: 'Oh O-phelia...',
  roomname: 'Ah ah...'
};

var App = function() {
  this.server = clientUrl;
  this.message = {};
  this.currentUser;
  this.currentRoom;
};

App.prototype.init = function() {
    this.fetch();
    var testMessage = {
      username: 'Mel Brooks',
      text: 'Never underestimate the power of the Schwartz!',
      roomname: 'test'
    }
    messagesArr.push(testMessage);
};

App.prototype.send = function(message) {
  $.ajax({
    url: clientUrl,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.fetch = function() {
  var context = this;

  $.ajax({
    url: context.server,
    contentType: "plain/text",
    type: "GET",
    success: function(data) {

    // console.log('data fetched', data);
      data.results.forEach(function(message) {
        messagesArr.push(message);
      })
      // console.log(messagesArr)
      messagesArr.forEach(function(message) {
        context.renderMessage(message);
      })

      context.getInitialRooms();
      context.populateRoomsList();




    },
    error: function(data) {
      console.log('failed to fetch data', data);
    }
  });
};

App.prototype.clearMessages = function() {
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

App.prototype.renderRoom = function() {

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

  
App.prototype.getInitialRooms = function() {
  
  messagesArr.forEach(function(message) {
    
    if (!roomsArray.includes(message.roomname)) {
      roomsArray.push(message.roomname);
    }
  })  
  // console.log(roomsArray);
};

App.prototype.populateRoomsList = function() {
  roomsArray.forEach(function(roomname) {
    var roomAnchor = document.createElement('a');
    roomAnchor.setAttribute('class', roomname);
    roomAnchor.append(document.createTextNode(roomname));
    $('.dropdown-content').append(roomAnchor);
  });
};

App.prototype.createMessage = function(username, text, roomname) {
  this.message.username = username;
  

}




$(document).ready(function() {

  var app = new App();

  app.init();

  $('.createMessage').on("click", function(event) {
    var message = $(".newMessage").val();
    // console.log(message);
  });

  $('.dropdown').on("click", ".dropdown-content", function(event) {
    app.currentRoom = this.textContent.trim();
    console.log(app.currentRoom)
    // console.log("'" + this.context + "'");
    var filteredArr = app.filterMessages('roomname', app.currentRoom);
    app.clearMessages();

    // console.log(app.currentRoom);

    filteredArr.forEach(function(message) {
      // console.log(message)
      app.renderMessage(message);
    })
    // console.log(filteredArr)
  })
});



