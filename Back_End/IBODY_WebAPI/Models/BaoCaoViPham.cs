using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class BaoCaoViPham
{
    public int Id { get; set; }

    public int? NguoiBaoCaoId { get; set; }

    public string? LoaiDoiTuong { get; set; }

    public int? DoiTuongId { get; set; }

    public string? LyDo { get; set; }

    public DateTime? ThoiGian { get; set; }

    public virtual TaiKhoan? NguoiBaoCao { get; set; }
}
