using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class HinhThucTuVan
{
    public int Id { get; set; }

    public string? Ten { get; set; }

    public int? ThoiLuongPhut { get; set; }

    public decimal? GiaCoBan { get; set; }

    public virtual ICollection<LichHen> LichHens { get; set; } = new List<LichHen>();
}
