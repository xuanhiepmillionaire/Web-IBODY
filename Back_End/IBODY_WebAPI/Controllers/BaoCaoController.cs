using IBODY_WebAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IBODY_WebAPI.Controllers
{
    [ApiController]
[Route("api/bao-cao")]
public class BaoCaoController : ControllerBase
{
    private readonly FinalIbodyContext _context;

    public BaoCaoController(FinalIbodyContext context)
    {
        _context = context;
    }

    [HttpPost("gui")]
    public async Task<IActionResult> GuiBaoCao([FromBody] BaoCaoDto dto)
    {
        var daGui = await _context.BaoCaoViPhams
            .AnyAsync(bc => bc.NguoiBaoCaoId == dto.NguoiBaoCaoId &&
                            bc.DoiTuongId == dto.ChuyenGiaTaiKhoanId &&
                            bc.LoaiDoiTuong == "chuyen_gia");
        if (daGui)
            return BadRequest("Bạn đã gửi báo cáo cho tài khoản này rồi.");

        var baoCao = new BaoCaoViPham
        {
            NguoiBaoCaoId = dto.NguoiBaoCaoId,
            LoaiDoiTuong = "chuyen_gia",
            DoiTuongId = dto.ChuyenGiaTaiKhoanId,
            LyDo = dto.LyDo,
            ThoiGian = DateTime.Now
        };

        _context.BaoCaoViPhams.Add(baoCao);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã gửi báo cáo. Admin sẽ xử lý sớm nhất." });
    }
}

public class BaoCaoDto
{
    public int NguoiBaoCaoId { get; set; }
    public int ChuyenGiaTaiKhoanId { get; set; } 
    public string LyDo { get; set; } = null!;
}




}