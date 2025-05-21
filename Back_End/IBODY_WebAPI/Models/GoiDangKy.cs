using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class GoiDangKy
{
    public int Id { get; set; }

    public int? TaiKhoanId { get; set; }

    public int? GoiDichVuId { get; set; }

    public DateTime NgayBatDau { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public int SoLuotConLai { get; set; }

    public string? TrangThai { get; set; }

    public virtual GoiDichVu? GoiDichVu { get; set; }

    public virtual TaiKhoan? TaiKhoan { get; set; }
}
