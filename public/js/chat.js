(function() {

    const socket = io.connect("http://localhost:8080")
    let joined = false

    const joinForm = $("#join-form"),
        nick = $("#nick"),
        chatForm = $("#chat-form"),
        chatWindow = $("#chat-window"),
        chatMessage = $("#message");
        chatStatus = Handlebars.compile($("#chat-status-temaplate").html())
        chatMessageBox = Handlebars.compile($("#chat-message-temaplate").html())

    joinForm.on("submit", function(e) {

        e.preventDefault();

        const nickName = $.trim( nick.val() );

        if(nickName === "") {
            nick.addClass("invalid");
        } else {
            nick.removeClass("invalid");

            socket.emit('join', nickName)

            joinForm.hide();
            chatForm.show();

            joined = true 
        }

    });

    chatForm.on("submit", function(e) {

        e.preventDefault();

        const message = $.trim( chatMessage.val() );

        if(message !== "") {
            socket.emit('message',message)
            chatMessage.val("");
        }

    });

    socket.on('status', function(data) {

        if(!joined) return 

        let html = chatStatus({
            status: data.status,
            time: formatDate(data.time)
        })

        chatWindow.append(html)
        scrollToBottom()
    })

    socket.on('message', function(data) {

        if(!joined) return

        let html = chatMessageBox({
            nick: data.nick,
            time: formatDate(data.time),
            message: data.message
        })
        chatWindow.append(html)
        scrollToBottom()
    })

    function scrollToBottom() {
        chatWindow.scrollTop(chatWindow.prop('scrollHeight'))
    }

    function formatDate(time) {
        let date = new Date(time),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds()

    return (hours < 10 ? "0" + hours : hours) + ':' +
    (minutes < 10 ? "0" + minutes : minutes) + ':' +
    (seconds < 10 ? "0" + seconds : seconds)
    }
})();