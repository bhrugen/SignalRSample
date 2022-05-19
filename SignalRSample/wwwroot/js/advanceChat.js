"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

var senderId = document.getElementById("hdUserId").value;


connection.start().then(function () {
    //sendButton.disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("ReceiveOnlineUsers", function (response) {

    for (i = 0; i < response.length; i++) {
        var spanOnline = document.getElementById(`spanOnline${response[i]}`);
        if (typeof (spanOnline) != 'undefined' && spanOnline != null) {
            // Exists.
            spanOnline.classList.add("bg-success");
            spanOnline.classList.remove("bg-danger");
            spanOnline.setAttribute("title", "Online");
        }

    }

});

connection.on("ReceiveUserConnected", function (userId,userName) {

    var spanOnline = document.getElementById(`spanOnline${userId}`);
    if (typeof (spanOnline) != 'undefined' && spanOnline != null) {
        // Exists.
        spanOnline.classList.add("bg-success");
        spanOnline.classList.remove("bg-danger");
        spanOnline.setAttribute("title", "Online");
    }

});

connection.on("ReceiveUserDisconnected", function (userId, userName) {

    var spanOnline = document.getElementById(`spanOnline${userId}`);
    if (typeof (spanOnline) != 'undefined' && spanOnline != null) {
        // Exists.
        spanOnline.classList.remove("bg-success");
        spanOnline.classList.add("bg-danger");
        spanOnline.setAttribute("title", "Offline");
    }


});

connection.on("ReceivePublicMessage", function (roomId, userId, username, message,roomName) {
    receivepublicMessage(roomId, userId, username, message);
});


connection.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    receiveaddnewRoomMessage(maxRoom, roomId, roomName, userId);
});

connection.on("ReceiveDeleteRoomMessage", function (deleted, selected, roomName, userName) {
    receivedeleteRoomMessage(deleted, selected);
});

connection.on("ReceivePrivateMessage", function (senderId, senderName, receiveId, message, chatId) {
    receiveprivateMessage(senderId, senderName, receiveId, message, chatId);
});

connection.on("ReceiveOpenPrivateChat", function (userId, userName) {
    receiveopenprivateChat(userId, userName, false);
});

connection.on("ReceiveDeletePrivateChat", function (chatId) {
    receivedeleteprivateChat(chatId);
});

function sendpublicMessage(roomId) {

    let sendButton = document.getElementById(`btnMessage${roomId}`);
    let inputMsg = document.getElementById(`inputMessage${roomId}`);

    var message = inputMsg.value;

    connection.invoke("SendPublicMessage", roomId, message, "").catch(function (err) {
        inputMsg.value = message;
        sendButton.disabled = false;
        return console.error(err.toString());
    });

    inputMsg.value = '';
    sendButton.disabled = true;
}



function addnewRoom(maxRoom) {

    let roomName = prompt("What will your chat room name be?\r\nIf you leave it blank, a name will be generated automatically!!");

    if (roomName == null) {
        return;
    }

   
    
    /*POST*/
    $.ajax({
        url: '/ChatRooms/PostChatRoom',
        dataType: "json",
        type: "POST",        
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({id:0,name:roomName}),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            connection.invoke("SendAddRoomMessage", maxRoom, json.id, json.name).catch(function (err) {
                return console.error(err.toString());
            });
        },
        error: function (xhr) {
            alert('error');
        }
    })

    //$.getJSON('/ChatRooms/PostChatRoom', { roomName: roomName })
    //    .done(function (json) {

    //        connection.invoke("SendAddRoomMessage", maxRoom, json.id, json.name).catch(function (err) {
    //            return console.error(err.toString());
    //        });

    //    })
    //    .fail(function (jqxhr, textStatus, error) {
    //        var err = textStatus + ", " + error;
    //        console.log("Request Failed: " + err);
    //    });


}

function deleteRoom(roomId, roomName) {
    let text = `Do you want to delete Chat Room ${roomName}?`;
    if (confirm(text) == false) {
        return;
    }

    /*DELETE*/
    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: 'application/json;',
        async: true,
        processData: false,
        cache: false,
        success: function (json) {
            connection.invoke("SendDeleteRoomMessage", json.deleted, json.selected, roomName).catch(function (err) {
                return console.error(err.toString());
            });
        },
        error: function (xhr) {
            alert('error');
        }
    });

    //$.getJSON('/ChatRooms/DeleteChatRoom', {id: roomId })
    //    .done(function (json) {

            //connection.invoke("SendDeleteRoomMessage", json.deleted, json.selected, roomName).catch(function (err) {
            //    return console.error(err.toString());
            //});

    //    })
    //    .fail(function (jqxhr, textStatus, error) {
    //        var err = textStatus + ", " + error;
    //        console.log("Request Failed: " + err);
    //    });
}

function sendprivateMessage() {

    var receiverId = document.getElementById("hdchatUserId").value;
    let inputMsg = document.getElementById('inputMessagePrivate');

    var message = inputMsg.value;

    connection.invoke("SendPrivateMessage", receiverId, message,"").catch(function (err) {
        inputMsg.value = message;
        return console.error(err.toString());
    });

    inputMsg.value = '';
}



function openprivateChat(userId, userName) {

    connection.invoke("SendOpenPrivateChat", userId).catch(function (err) {
        return console.error(err.toString());
    });

    receiveopenprivateChat(userId, userName, true);
}



function deleteprivateChat(chatId) {
    connection.invoke("SendDeletePrivateChat", chatId).catch(function (err) {
        return console.error(err.toString());
    });
}