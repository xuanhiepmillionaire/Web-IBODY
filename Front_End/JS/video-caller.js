const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5221/videoCallHub")
    .build();

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const callBtn = document.getElementById("callBtn");
const endBtn = document.getElementById("endBtn");

let peerConnection;
let localStream;
const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

const receiverId = new URLSearchParams(window.location.search).get("to");
if (!receiverId) {
  alert("Không có ID người nhận trong URL");
  throw new Error("Missing receiverId");
}


// Kết nối SignalR
connection.start().then(async () => {
    console.log("SignalR connected (caller).");
}).catch(console.error);

// Nhận answer từ người nhận
connection.on("ReceiveAnswer", async (senderId, answer) => {
    const desc = new RTCSessionDescription(JSON.parse(answer));
    await peerConnection.setRemoteDescription(desc);
});

// Nhận ICE từ người nhận
connection.on("ReceiveCandidate", async (senderId, candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
});

// Bắt đầu cuộc gọi
callBtn.onclick = async () => {
    document.getElementById("videoContainer").style.display = "block";

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection(config);

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            connection.invoke("SendCandidate", receiverId, JSON.stringify(event.candidate));
        }
    };

    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    await connection.invoke("StartCall", receiverId); // ✅ Kích hoạt lời mời gọi

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    connection.invoke("SendOffer", receiverId, JSON.stringify(offer));
};

// Kết thúc gọi
endBtn.onclick = () => {
    connection.invoke("EndCall", receiverId);
    peerConnection.close();
    peerConnection = null;
    document.getElementById("videoContainer").style.display = "none";
};
