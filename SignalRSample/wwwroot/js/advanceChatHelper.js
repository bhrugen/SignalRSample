// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function receiveaddnewRoomMessage(maxRoom, roomId, roomName, userId) {

    var newli = document.createElement("li");

    /*let ui = li.parentNode;*/
    let ui = document.getElementById("ulroomTabs");
    let li = document.getElementById("liaddnewRoom");

    var roomHeight = 450;
    var deleteicon = '';
    var changeTab = false;

    if (typeof (li) != 'undefined' && li != null) {
        roomHeight = 280;
        deleteicon = `<i class="bi bi-trash text-danger deleteRoom" onclick="deleteRoom(${roomId},'${roomName}')"></i>`;

        if (li.firstElementChild.classList.contains('active')) {
            changeTab = true;
        }
    } else {
        if (ui.children.length == 0) {
            changeTab = true;
        }
    }

    if (userId == document.getElementById("hdUserId").value) {
        changeTab = true;
    }



    newli.innerHTML = `<a class="nav-link text-center" id="room${roomId}-tab" data-bs-toggle="tab"
                            href="#room${roomId}" role="tab" aria-controls="room${roomId}"
                            aria-selected="true">
                                ${roomName} ${deleteicon}
                                </a>`;

    newli.classList.add('nav-item');
    newli.classList.add('w-25');

    newli.setAttribute("role", "presentation");

    if (changeTab) {
        newli.firstElementChild.classList.add('active');
    }

    ui.appendChild(newli);

    if (typeof (li) != 'undefined' && li != null) {
        ui.removeChild(li);
        ui.appendChild(li);
    }


    let newdiv = document.createElement("div");
    var divrooms = document.getElementById('divRooms');



    newdiv.classList.add('tab-pane');
    newdiv.classList.add('fade');

    newdiv.classList.add('h-100');

    newdiv.setAttribute("id", `room${roomId}`);

    newdiv.setAttribute("role", "tabpanel");

    newdiv.setAttribute("aria-labelledby", `room${roomId}-tab`);

    if (ui.childElementCount > maxRoom) {
        if (typeof (li) != 'undefined' && li != null) {
            li.classList.add('d-none');
        }
    }

    var serchaInput = '';
    if (typeof (li) != 'undefined' && li != null) {
        serchaInput = `<div class="flex-column">
                                            <div class="row g-3 align-items-center">
                                                <div class="col-auto">
                                                    <label for="inputMessage${roomId}" class="col-form-label">Message</label>
                                                  </div>
                                                  <div class="col">
                                                    <input type="text" id="inputMessage${roomId}" onkeyup="readypublicMessage(${roomId})" class="form-control">
                                                  </div>
                                                  <div class="col-auto">
                                                      <button type="button" disabled
                                                        id="btnMessage${roomId}"
                                                      onclick="sendpublicMessage(${roomId})" class="btn btn-primary">Send</button>
                                                  </div>
                                            </div>
                                        </div>`;



    }

    newdiv.innerHTML = `<div class="container  h-100"><div class="row h-100 flex-column p-3"> 
                    <div class="flex-fill border border-dark rounded" style="overflow:hidden;">
                        <div class="d-block" id="divChatbox${roomId}" style="overflow-y:auto; max-height: ${roomHeight}px">
                            <ul class="p-2" style="list-style-type:none;" id="ulmessagesList${roomId}">

                            </ul>
                        </div>
                    </div>
                        ${serchaInput}
                                        
            </div></div>`;

    divrooms.appendChild(newdiv);


    setTimeout(
        function () {

            /*li.firstElementChild.classList.remove('active');*/

            if (changeTab) {
                var childli = ui.getElementsByTagName('li');
                var childDivs = divrooms.getElementsByTagName('div');

                for (i = 0; i < childDivs.length; i++) {
                    childDivs[i].classList.remove('show');
                    childDivs[i].classList.remove('active');
                }

                newdiv.classList.add('active');
                newdiv.classList.add('show');


                for (i = 0; i < childli.length; i++) {
                    childli[i].firstElementChild.classList.remove('active');
                }

                newli.firstElementChild.classList.add('active');
            }
        }, 100);




    /*li.classList.remove('active');*/

}

function receivepublicMessage(roomId, userId, username, message) {



    let ulmessagesList = document.getElementById(`ulmessagesList${roomId}`);

    let li = document.createElement("li");
    let newmsg = document.createElement("p");

    if (userId == document.getElementById("hdUserId").value || document.getElementById("hdUserId").value == '') {
        newmsg.innerHTML = `${username} says ${message}`;
    }
    else {
        newmsg.innerHTML = `<i role="button" class="bi bi-arrow-right-circle text-primary" onclick="openprivateChat('${userId}','${username}')"> </i> ${username} says ${message}`;
    }



    li.appendChild(newmsg);
    ulmessagesList.appendChild(li);

    li.scrollIntoView(false);
    li.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });


}

function readypublicMessage(roomId) {

    let inputMsg = document.getElementById(`inputMessage${roomId}`);
    let sendButton = document.getElementById(`btnMessage${roomId}`);

    if (inputMsg.value.length == 0) {
        sendButton.disabled = true;
    } else {
        sendButton.disabled = false;
    }
}

function receiveprivateMessage(senderId, senderName, receiveId, message, chatId) {

    var chatboxName = `ulmessagesList${receiveId}`;

    if (receiveId === document.getElementById("hdUserId").value) {
        chatboxName = `ulmessagesList${senderId}`;
    }

    let ulmessagesList = document.getElementById(chatboxName);

    if (typeof (ulmessagesList) == 'undefined' || ulmessagesList == null) {
        receiveopenprivateChat(senderId, senderName)
        ulmessagesList = document.getElementById(chatboxName);
    }


    let li = document.createElement("li");
    let newmsg = document.createElement("p");

    newmsg.setAttribute("id", chatId);

    newmsg.classList.add('alert');
    newmsg.classList.add('px-2');


    if (senderId === document.getElementById("hdUserId").value) {
        newmsg.classList.add('me-3');
        newmsg.classList.add('text-end');
        newmsg.classList.add('alert-primary');
        newmsg.innerHTML = `${message} <i role="button" class="bi bi-x-circle text-danger" onclick="deleteprivateChat('${chatId}')"> </i>`;
    } else {
        newmsg.classList.add('ms-1');
        newmsg.classList.add('alert-info');
        newmsg.innerHTML = `<i role="button" class="bi bi-x-circle text-danger" onclick="deleteprivateChat('${chatId}')"> </i> ${message}`;
    }



    li.appendChild(newmsg);
    ulmessagesList.appendChild(li);

    li.scrollIntoView(false);
    li.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    notifyUnreadMessage(1);

}

function readyprivateMessage() {

    let inputMsg = document.getElementById('inputMessagePrivate');
    let sendButton = document.getElementById('btnMessagePrivate');

    if (inputMsg.value.length == 0) {
        sendButton.disabled = true;
    } else {
        sendButton.disabled = false;
    }
}

function setchatuserId(userId) {
    document.getElementById('hdchatUserId').value = userId;
}

function receivedeleteRoomMessage(deleted, selected) {

    let ui = document.getElementById("ulroomTabs");
    let link = document.getElementById(`room${deleted}-tab`);

    let li = link.parentNode;
    /*let ui = li.parentNode;*/

    let divrooms = document.getElementById('divRooms');
    let childdiv = document.getElementById(`room${deleted}`);

    var changetab = true;
    if (link.classList.contains('active') == false) {
        changetab = false;
    }

    ui.removeChild(li);
    divrooms.removeChild(childdiv);

    setTimeout(
        function () {

            var childli = ui.getElementsByTagName('li');
            var childDivs = divrooms.getElementsByTagName('div');


            let liaddnew = document.getElementById("liaddnewRoom");

            if (changetab) {

                for (i = 0; i < childDivs.length; i++) {
                    childDivs[i].classList.remove('show');
                    childDivs[i].classList.remove('active');
                }

                for (i = 0; i < childli.length; i++) {
                    childli[i].firstElementChild.classList.remove('active');
                }

            }

            if (Number(selected) > 0) {

                if (changetab) {

                    let newdiv = document.getElementById(`room${selected}`);
                    let link1 = document.getElementById(`room${selected}-tab`);

                    let newli = link1.parentNode;

                    newdiv.classList.add('active');
                    newdiv.classList.add('show');


                    newli.firstElementChild.classList.add('active');
                }

                liaddnew.classList.remove('d-none');

            } else {

                //newli.classList.add('show');
                //newli.classList.add('active');

                liaddnew.firstElementChild.classList.add('active');
            }


        }, 100);

}

function receiveopenprivateChat(userId, userName, tabchange) {

    let pubtab = document.getElementById('public-tab');
    let pribtab = document.getElementById('private-tab');

    let pubtabbox = document.getElementById('publictabbox');
    let pribtabbox = document.getElementById('privatetabbox');

    if (tabchange) {

        pubtab.classList.remove('active');
        pribtab.classList.add('active');

        pubtabbox.classList.remove('show');
        pubtabbox.classList.remove('active');

        pribtabbox.classList.add('show');
        pribtabbox.classList.add('active');
    }

    document.getElementById('hdchatUserId').value = userId;

    let div = document.getElementById("list-tab");

    var newa = document.getElementById(`list-${userId}-list`);
    if (typeof (newa) != 'undefined' && newa != null) {
        // Exists.
        newa.classList.add('active');
    }
    else {

        var children = div.children;
        for (var i = 0; i < children.length; i++) {
            children[i].classList.remove('active');
        }

        newa = document.createElement("a");

        newa.classList.add('list-group-item');
        newa.classList.add('list-group-item-action');
        newa.classList.add('active');

        newa.setAttribute("id", `list-${userId}-list`);

        newa.setAttribute("data-bs-toggle", `list`);
        newa.setAttribute("href", `#list-${userId}`);
        newa.setAttribute("role", `tab`);
        newa.setAttribute("aria-controls", `list-${userId}`);

        newa.setAttribute("onclick", `setchatuserId('${userId}')`);

        newa.innerHTML = `<div class="row">
                        <div class="col"> 
                            <i role="button" class="bi bi-x-lg" title="Close chat" onclick="deleteprivatechatGroup('${userId}')"> </i> ${userName}
                        </div>
                        <div class="col-auto">
                            <i class="block-text align-middle bg-success rounded-circle"
                                id="spanOnline${userId}" style="margin-left:5px;" title="Online">
                                </i>
                        </div>
                    </div>`;

        div.appendChild(newa);
    }

    let div1 = document.getElementById("nav-tabContent");

    var div2 = document.getElementById(`list-${userId}`);

    if (typeof (div2) != 'undefined' && div2 != null) {
        // Exists.
        div2.classList.add('active');
        div2.classList.add('show');
    }
    else {


        var children = div1.children;
        for (var i = 0; i < children.length; i++) {
            children[i].classList.remove('active');
            children[i].classList.remove('show');
        }

        div2 = document.createElement("div");

        div2.classList.add('tab-pane');
        div2.classList.add('fade');
        div2.classList.add('active');
        div2.classList.add('show');

        div2.setAttribute("id", `list-${userId}`);

        div2.setAttribute("aria-labelledby", `list-${userId}-list`);
        div2.setAttribute("role", `tabpanel`);

        div2.innerHTML = `<div style="overflow: hidden;"> 
                        <div class="d-block px-2 pb-2"  style="overflow-y:auto; max-height:400px">  
                            <ul class="p-2" style="list-style-type:none;" id="ulmessagesList${userId}">

                            </ul>
                        </div>
                    </div>`;

        div1.appendChild(div2);
    }
}

function receivedeleteprivateChat(chatid) {

    let p = document.getElementById(chatid);
    let li = p.parentNode;
    let ui = li.parentNode;

    ui.removeChild(li);

    notifyUnreadMessage(2);

}

function setchatboxColor(elementid, color) {
    document.getElementById('private-badge').innerText = '';
    document.getElementById(elementid).style.backgroundColor = color;
}

function deleteprivatechatGroup(userId) {

    var selectedDelete = false;
    let div = document.getElementById("list-tab");

    var newa = document.getElementById(`list-${userId}-list`);
    if (typeof (newa) != 'undefined' && newa != null) {

        if (newa.classList.contains('active')) {
            selectedDelete = true;
        }

        div.removeChild(newa);
    }

    let div1 = document.getElementById("nav-tabContent");

    var div2 = document.getElementById(`list-${userId}`);

    if (typeof (div2) != 'undefined' && div2 != null) {
        div1.removeChild(div2);
    }


    if (div.children.length == 0) {


        let pubtab = document.getElementById('public-tab');
        let pribtab = document.getElementById('private-tab');

        pubtab.classList.add('active');
        pribtab.classList.remove('active');

        let pubtabbox = document.getElementById('publictabbox');
        let pribtabbox = document.getElementById('privatetabbox');

        pubtabbox.classList.add('show');
        pubtabbox.classList.add('active');

        pribtabbox.classList.remove('show');
        pribtabbox.classList.remove('active');

    } else {
        if (selectedDelete) {

            div.children[0].classList.remove('show');
            div.children[0].classList.remove('active');
            div1.children[0].classList.remove('active');

            document.getElementById('hdchatUserId').value = div1.children[0].getAttribute('id').replace('list-', '');

        }


    }

}

function notifyUnreadMessage(action) {

    let pubtab = document.getElementById('public-tab');
    let badge = document.getElementById('private-badge');

    if (pubtab.classList.contains('active')) {

        var badgeval = Number(badge.innerText);
        if (action == 1) {
            badgeval = badgeval + 1;
        }
        else {
            badgeval = badgeval - 1;
        }

        if (badgeval == 0) {
            badge.innerText = '';
        }
        else if (badgeval <= 99) {
            badge.innerText = badgeval;
        } else {
            badge.innerText = '99+';
        }
    }


}