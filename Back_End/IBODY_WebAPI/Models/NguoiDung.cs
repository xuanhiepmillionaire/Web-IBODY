using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class NguoiDung
{
    public int Id { get; set; }

    public int? TaiKhoanId { get; set; }

    public string? HoTen { get; set; }

    public DateTime? NgaySinh { get; set; }

    public string? GioiTinh { get; set; }

    public string? MucTieuTamLy { get; set; }

    public string? AvatarUrl { get; set; }

    public virtual ICollection<DanhGium> DanhGia { get; set; } = new List<DanhGium>();

    public virtual ICollection<LichHen> LichHens { get; set; } = new List<LichHen>();

    public virtual TaiKhoan? TaiKhoan { get; set; }
}
