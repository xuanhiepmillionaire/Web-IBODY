using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class GiaoDich
{
    public int Id { get; set; }

    public int? HoaDonId { get; set; }

    public int? PhuongThucId { get; set; }

    public decimal? SoTien { get; set; }

    public DateTime? ThoiGian { get; set; }

    public virtual HoaDon? HoaDon { get; set; }

    public virtual PhuongThucChung? PhuongThuc { get; set; }
}
