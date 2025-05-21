using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class HocVanChuyenGium
{
    public int Id { get; set; }

    public int? ChuyenGiaId { get; set; }

    public string? Truong { get; set; }

    public string? BangCap { get; set; }

    public string? ChuyenNganh { get; set; }

    public int? NamTotNghiep { get; set; }

    public virtual ChuyenGium? ChuyenGia { get; set; }
}
