using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class LichHen
{
    public int Id { get; set; }

    public int? NguoiDungId { get; set; }

    public int? ChuyenGiaId { get; set; }

    public int? HinhThucId { get; set; }

    public DateTime? ThoiGianBatDau { get; set; }

    public DateTime? ThoiGianKetThuc { get; set; }

    public string? TomTat { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ChuyenGium? ChuyenGia { get; set; }

    public virtual ICollection<DanhGium> DanhGia { get; set; } = new List<DanhGium>();

    public virtual HinhThucTuVan? HinhThuc { get; set; }

    public virtual NguoiDung? NguoiDung { get; set; }
}
