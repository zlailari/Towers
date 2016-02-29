/*
document ready.
*/
$(document).ready(function() {
/*
  declare gloabl box variable,
  so we can check if box is alreay open,
  when user click toggle button
  */
  var box = null;
  /*
  we are now adding click hanlder for 
  toggle button.
  */

  $("input[type='button']").click(function(event, ui) {
    /*
      now if box is not null,
      we are toggling chat box.
    */
    if(box) {
      /*
        below code will hide the chatbox that 
        is active, when first clicked on toggle button
      */
      box.chatbox("option", "boxManager").toggleBox();
      } else {
          /*
            if box variable is null then we will create
            chat-box.
          */
        box = $("#chat_div").chatbox( {
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
            $(".log").append(id + " said: " + msg + "<br/>");
            $("#chat_div").chatbox("option", "boxManager").addMsg(id, msg);
          }
        } );
      }
    });
});