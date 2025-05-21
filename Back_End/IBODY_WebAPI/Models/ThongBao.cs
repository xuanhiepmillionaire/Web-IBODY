using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class ThongBao
{
    public int Id { get; set; }

    public int? TaiKhoanId { get; set; }

    public string? Loai { get; set; }

    public string? NoiDung { get; set; }

    public DateTime? DaDocLuc { get; set; }

    public virtual TaiKhoan? TaiKhoan { get; set; }
}
