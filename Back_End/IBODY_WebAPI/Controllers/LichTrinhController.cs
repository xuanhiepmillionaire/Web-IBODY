using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IBODY_WebAPI.Models;

namespace IBODY_WebAPI.Controllers
{
    [ApiController]
    [Route("api/lich-trinh")]
    public class LichTrinhController : ControllerBase
    {
        private readonly FinalIbodyContext _context;
        public LichTrinhController(FinalIbodyContext context)
        {
            _context = context;
        }

        [HttpGet("nguoi-dung/{nguoiDungId}")]
        public async Task<IActionResult> GetLichHenNguoiDung(int nguoiDungId)
        {
            var lichGoc = await _context.LichHens
                .Where(lh => lh.NguoiDungId == nguoiDungId)
                .Include(lh => lh.ChuyenGia)
                .Include(lh => lh.HinhThuc)
                .ToListAsync();

        await _context.SaveChangesAsync();
        var lich = lichGoc
            .OrderBy(l => l.ThoiGianBatDau)
            .Select(l => new
            {
                l.Id,
                l.ThoiGianBatDau,
                l.ThoiGianKetThuc,
                ChuyenGia = new
                {
                    l.ChuyenGia.Id,
                    l.ChuyenGia.HoTen,
                    l.ChuyenGia.ChuyenMon
                },
                HinhThuc = l.HinhThuc.Ten,
                l.TomTat,
                l.TrangThai
            }).ToList();

        return Ok(lich);
        }



        [HttpDelete("huy-lich/{lichHenId}")]
        public async Task<IActionResult> HuyLichHen(int lichHenId)
        {

            var danhGiaLienQuan = _context.DanhGia.Where(dg => dg.LichHenId == lichHenId);
            _context.DanhGia.RemoveRange(danhGiaLienQuan); // phải xóa đánh giá trước vì nó có khóa ngoại với lịch hẹn

            var lich = await _context.LichHens.FindAsync(lichHenId);
            if (lich == null)
                return NotFound(new { message = "Lịch hẹn không tồn tại." });

            if (lich.TrangThai == "da_dien_ra")
                return BadRequest(new { message = "Lịch đã thanh toán, không thể hủy." });
           
            _context.LichHens.Remove(lich);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã hủy lịch hẹn thành công." });
        }


    }
}
