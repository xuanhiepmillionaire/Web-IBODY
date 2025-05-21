using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class PhuongThucNguoiDung
{
    public int Id { get; set; }

    public int TaiKhoanId { get; set; }

    public int PhuongThucId { get; set; }

    public string? ChiTiet { get; set; }

    public bool? DaXacThuc { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual PhuongThucChung PhuongThuc { get; set; } = null!;

    public virtual TaiKhoan TaiKhoan { get; set; } = null!;
}
