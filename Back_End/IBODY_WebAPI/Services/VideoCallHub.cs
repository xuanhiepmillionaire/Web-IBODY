using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class VideoCallHub : Hub
{
    // Khi có người gọi video
    public async Task StartCall(string receiverId)
    {
        await Clients.User(receiverId).SendAsync("CallRequested", Context.UserIdentifier);
    }

    // Gửi Offer SDP
    public async Task SendOffer(string receiverId, string offer)
    {
        await Clients.User(receiverId).SendAsync("ReceiveOffer", Context.UserIdentifier, offer);
    }

    // Gửi Answer SDP
    public async Task SendAnswer(string receiverId, string answer)
    {
        await Clients.User(receiverId).SendAsync("ReceiveAnswer", Context.UserIdentifier, answer);
    }

    // ICE Candidate
    public async Task SendCandidate(string receiverId, string candidate)
    {
        await Clients.User(receiverId).SendAsync("ReceiveCandidate", Context.UserIdentifier, candidate);
    }

    // Kết thúc cuộc gọi
    public async Task EndCall(string receiverId)
    {
        await Clients.User(receiverId).SendAsync("CallEnded", Context.UserIdentifier);
    }
}
