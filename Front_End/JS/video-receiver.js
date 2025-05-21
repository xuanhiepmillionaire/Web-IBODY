const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5221/videoCallHub")
    .build();

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let peerConnection;
let localStream;
const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

let callerId = null;

connection.start().then(() => {
    console.log("SignalR connected (receiver).");
}).catch(console.error);

// Khi có cuộc gọi đến
connection.on("CallRequested", async (senderId) => {
    callerId = senderId;
    const accept = confirm("Bạn có cuộc gọi đến. Chấp nhận không?");
    if (!accept) return;

    document.getElementById("videoContainer").style.display = "block";

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(config);

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            connection.invoke("SendCandidate", callerId, JSON.stringify(event.candidate));
        }
    };

    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });
});

// Khi nhận offer
connection.on("ReceiveOffer", async (senderId, offer) => {
    const desc = new RTCSessionDescription(JSON.parse(offer));
    await peerConnection.setRemoteDescription(desc);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    connection.invoke("SendAnswer", senderId, JSON.stringify(answer));
});

// Khi nhận ICE
connection.on("ReceiveCandidate", async (senderId, candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
});

// Khi người gọi kết thúc
connection.on("CallEnded", () => {
    alert("Cuộc gọi đã kết thúc");
    peerConnection.close();
    peerConnection = null;
    document.getElementById("videoContainer").style.display = "none";
});
