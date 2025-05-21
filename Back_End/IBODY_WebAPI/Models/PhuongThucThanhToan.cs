using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class PhuongThucThanhToan
{
    public int Id { get; set; }

    public int? TaiKhoanId { get; set; }

    public string? Loai { get; set; }

    public string? ChiTiet { get; set; }

    public virtual ICollection<GiaoDich> GiaoDiches { get; set; } = new List<GiaoDich>();

    public virtual TaiKhoan? TaiKhoan { get; set; }
}
