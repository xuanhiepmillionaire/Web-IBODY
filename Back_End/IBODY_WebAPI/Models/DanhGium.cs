using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class DanhGium
{
    public int Id { get; set; }

    public int? LichHenId { get; set; }

    public int? NguoiDungId { get; set; }

    public int? ChuyenGiaId { get; set; }

    public int? DiemSo { get; set; }

    public string? NhanXet { get; set; }

    public virtual ChuyenGium? ChuyenGia { get; set; }

    public virtual LichHen? LichHen { get; set; }

    public virtual NguoiDung? NguoiDung { get; set; }
}
