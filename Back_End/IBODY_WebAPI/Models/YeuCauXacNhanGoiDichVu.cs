using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class YeuCauXacNhanGoiDichVu
{
    public int Id { get; set; }

    public int TaiKhoanId { get; set; }

    public int GoiDichVuId { get; set; }

    public string? NoiDungChuyenKhoan { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }
}
