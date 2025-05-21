using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class HoaDon
{
    public int Id { get; set; }

    public int? TaiKhoanId { get; set; }

    public int? GoiDichVuId { get; set; }

    public decimal? TongTien { get; set; }

    public DateTime? ThoiGianTao { get; set; }

    public virtual ICollection<GiaoDich> GiaoDiches { get; set; } = new List<GiaoDich>();

    public virtual GoiDichVu? GoiDichVu { get; set; }

    public virtual TaiKhoan? TaiKhoan { get; set; }
}
