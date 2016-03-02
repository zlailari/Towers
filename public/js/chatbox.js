/*
document ready.
*/
$(document).ready(function() {
/*
  declare gloabl box variable,
  so we can check if box is alreay open,
  when user click toggle button
  */
  var box = $("#chat_div").chatbox( {
    /*
      unique id for chat box
    */
    id:"Runnable",
    user:
    {
      key : "value"
    },
    /*
      Title for the chat box
    */
    title : "Runnable User",
    /*
      messageSend as name suggest,
      this will called when message sent.
      and for demo we have appended sent message to our log div.
    */
    messageSent : function(id, user, msg) {
      $("#chat_div").chatbox("option", "boxManager").addMsg(id, msg);
    }
  });
  /* Minimize the chatbox after instantiation */
  box.chatbox("option", "boxManager").toggleBox();

  /* Add listener to expand the chat box when enter is pressed */
  $(document).keypress(function(e) {
    if(e.which == 13) {
      if(!box.chatbox("option", "boxManager").isVisible()) {
        box.chatbox("option", "boxManager").toggleBox();
      }
    }
  });
});