using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Protocol;
using System.Security.Claims;

namespace IBODY_WebAPI.Helpers
{
    public class NameIdentifierUserIdProvider : Microsoft.AspNetCore.SignalR.IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            // Lấy userId từ claim "NameIdentifier" (mặc định là ApplicationUser.Id)
            return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
