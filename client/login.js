//var socket = io();

function tryLogin()
{
    window.location.href='aggie_schedules.html'; //TEMP
    var uname = document.getElementById("usernameText").value;
    //socket.emit('login', {username: uname, password: "pword"});
}

// socket.on('loginStatus', function(text) {
//     document.getElementById("usernameText").value = text;
//     if(text == "pass")
//     {
//         window.location.href='aggie_schedules.html';
//     }
//     else if(text == "fail")
//     {
//         //Pop up red fail text
//     }
// });