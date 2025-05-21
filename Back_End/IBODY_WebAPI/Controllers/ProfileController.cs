using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using IBODY_WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace IBODY_WebAPI.Controllers;
[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly FinalIbodyContext _context;

    public ProfileController(FinalIbodyContext context)
    {
        _context = context;
    }

    [HttpPost("request-upgrade")]
    public async Task<IActionResult> RequestUpgradeToExpert([FromBody] ExpertUpgradeDto dto)
    {
        // Kiểm tra tài khoản có tồn tại không
        var user = await _context.TaiKhoans.FindAsync(dto.TaiKhoanId);
        if (user == null)
            return NotFound(new { message = "Không tìm thấy tài khoản." });

        // Kiểm tra nếu đã gửi yêu cầu rồi
        if (await _context.ChuyenGia.AnyAsync(x => x.TaiKhoanId == dto.TaiKhoanId))
            return BadRequest(new { message = "Bạn đã gửi yêu cầu trước đó." });

        var expert = new ChuyenGium
        {
            TaiKhoanId = dto.TaiKhoanId,
            HoTen = dto.HoTen,
            SoNamKinhNghiem = dto.SoNamKinhNghiem,
            SoChungChi = dto.SoChungChi,
            ChuyenMon = dto.ChuyenMon,
            GioiThieu = dto.GioiThieu,
            TrangThai = "cho_duyet"
        };

        _context.ChuyenGia.Add(expert);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã gửi yêu cầu nâng cấp. Vui lòng chờ xác nhận từ admin." });
    }
}

public class ExpertUpgradeDto
{
    public int TaiKhoanId { get; set; }
    public string HoTen { get; set; } = null!;
    public int SoNamKinhNghiem { get; set; }
    public string SoChungChi { get; set; } = null!;
    public string ChuyenMon { get; set; } = null!;
    public string GioiThieu { get; set; } = null!;
}
