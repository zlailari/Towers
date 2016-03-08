// This file handles creates and has the functions governing messages in the Chatbox

var chatbox = null;

$(document).ready(function() {
    // Sets up a jquery ui chatbox
    var box = $("#chat_div").chatbox({
        id: "Runnable",
        user: {key: "value"},
        title: "Runnable User",
        messageSent : function(id, user, msg) {
            ws.sendChat(id, msg);
            /* name of the person sending the message.  msg is the text
            displayed next to the message*/
            $("#chat_div").chatbox("option", "boxManager").addMsg(id, msg);
        }
    });
    chatbox = box.chatbox("option", "boxManager");
    // Minimize the chatbox after instantiation
    chatbox.toggleBox();

    // Add listener to expand the chat box when enter is pressed
    $(document).keydown(function(e) {
        // key value 13 = 'Enter'
        if (e.which == $.ui.keyCode.ENTER) {
            if (!chatbox.isVisible()) {
                chatbox.toggleBox();
            }
        } else if (e.which == $.ui.keyCode.ESCAPE) {
            if (towerButtons.getLastButton()) {
                towerButtons.clearLastButton();
            } else if (chatbox.isVisible()) {
                chatbox.toggleBox();
            }
        }
    });
});
