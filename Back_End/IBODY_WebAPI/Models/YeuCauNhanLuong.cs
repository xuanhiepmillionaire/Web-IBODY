using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class YeuCauNhanLuong
{
    public int Id { get; set; }

    public int ChuyenGiaId { get; set; }

    public int SoCa { get; set; }

    public decimal SoTien { get; set; }

    public DateTime? NgayTao { get; set; }

    public string? TrangThai { get; set; }

    public virtual ChuyenGium ChuyenGia { get; set; } = null!;
}
