import { handleSendNotification } from './firebase_functions.js';


document.getElementById('send-notification').addEventListener('click', async function(event) {

    //prevent default options when submit
    event.preventDefault(); 
    handleSendNotification;
});


// Initially disable the send notification button until users are loaded
document.getElementById('send-notification').disabled = true;