// This file handles creates and has the functions governing messages in the Chatbox

$(document).ready(function() {
    // Sets up a jquery ui chatbox
    window.box = $("#chat_div").chatbox( {
        id: "Runnable",
        user: { key: "value" },
        title: "Runnable User",
        messageSent : function(id, user, msg) {
            ws.sendChat(id, msg);
            /*name of the person sending the message.  msg is the text
            displayed next to the message*/
            $("#chat_div").chatbox("option", "boxManager").addMsg(id, msg);
        }
    });

    // Minimize the chatbox after instantiation
    box.chatbox("option", "boxManager").toggleBox();

    // Add listener to expand the chat box when enter is pressed
    $(document).keypress(function(e) {
        // key value 13 = 'Enter'
        if(e.which == 13) {
            if(!box.chatbox("option", "boxManager").isVisible()) {
                box.chatbox("option", "boxManager").toggleBox();
            }
        }
    });
});
