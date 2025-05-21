using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class GoiDichVu
{
    public int Id { get; set; }

    public string? Ten { get; set; }

    public string? MoTa { get; set; }

    public decimal? Gia { get; set; }

    public int? ThoiHanNgay { get; set; }

    public string? DanhCho { get; set; }

    public int SoLuot { get; set; }

    public virtual ICollection<GoiDangKy> GoiDangKies { get; set; } = new List<GoiDangKy>();

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();
}
