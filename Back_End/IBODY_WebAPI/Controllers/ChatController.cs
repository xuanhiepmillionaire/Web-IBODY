using IBODY_WebAPI.Models;
using IBODY_WebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IBODY_WebAPI.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly ChatMessageService _chatService;

        public ChatController(ChatMessageService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessage msg)
        {
            if (string.IsNullOrWhiteSpace(msg.Content))
                return BadRequest("Nội dung không được để trống.");

            await _chatService.AddMessage(msg);
            return Ok(new { message = "Đã gửi tin nhắn." });
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetMessages([FromQuery] int user1, [FromQuery] int user2)
        {
            var messages = await _chatService.GetMessages(user1, user2);
            return Ok(messages);
        }
    }
}
