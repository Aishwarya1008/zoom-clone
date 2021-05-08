{
    console.log('Hello ');

    const socket = io("http://localhost:5000");

    const videoGrid = document.getElementById('video-grid');
    const myVideo = document.createElement('video');


    var peer = new Peer();

    peer.on('open', (id) => {
        console.log('peer id', id);
        socket.emit('join_room', {
            roomId: ROOM_ID,
            userId: id
        });
    });

    let myVideoStream;
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, myVideoStream);
        
        peer.on('call', (call) => {
            call.answer(stream);
            const video = document.createElement('video');
            call.on('stream', (otherUserStream) => {
                addVideoStream(video, otherUserStream);
            });
        });


        socket.on('User_Joined', (userId) => {
            console.log('User Joined', userId);
            connectToNewUser(userId, stream);
        });
    });

    addVideoStream = (video, stream) => {
        //set the source of the video
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        videoGrid.append(video);
    }


    const connectToNewUser = (userId, stream) => {
        const call = peer.call(userId, stream);
        const video = document.createElement('video');
        call.on('stream', (otherUserStream) => {
            addVideoStream(video, otherUserStream);
        });
    }
    
    let text = $('input');
    $('html').keydown((e) => {
        if(e.which == 13 && text.val().length !== 0){
            console.log('pressed');
            socket.emit('message', {
                msg: text.val()
            })
            text.val('');
        }
    });

    socket.on('send_message', (data) => {
        console.log('message from server', data.msg);
        $("ul").append(`<li class="message"><b>user</b><br/>${data.msg}</li>`);
        scrollToBottom();
    });

    const scrollToBottom = () => {
        let d = $('.main__chat__window');
        d.scrollTop(d.prop("scrollHeight"));
    }


    $('#microphone').on('click', () => {
        const enabled = myVideoStream.getAudioTracks()[0].enabled;
        if(enabled){
            myVideoStream.getAudioTracks()[0].enabled = false;
            setUnmuteButton();
        } else {
            setMuteButton();
            myVideoStream.getAudioTracks()[0].enabled = true;
        }
    });
    

    const setMuteButton = () => {
        const html = `
          <i class="fas fa-microphone"></i>
          <span>Mute</span>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
      }
      
      const setUnmuteButton = () => {
        const html = `
          <i class="unmute fas fa-microphone-slash"></i>
          <span>Unmute</span>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
      }

      $('#video').on('click', () => {
        let enabled = myVideoStream.getVideoTracks()[0].enabled;
        if (enabled) {
          myVideoStream.getVideoTracks()[0].enabled = false;
          setPlayVideo()
        } else {
          setStopVideo()
          myVideoStream.getVideoTracks()[0].enabled = true;
        }
      });

      const setStopVideo = () => {
        const html = `
          <i class="fas fa-video"></i>
          <span>Stop Video</span>
        `
        document.querySelector('.main__video_button').innerHTML = html;
      }
      
      const setPlayVideo = () => {
        const html = `
        <i class="stop fas fa-video-slash"></i>
          <span>Play Video</span>
        `
        document.querySelector('.main__video_button').innerHTML = html;
      }
}