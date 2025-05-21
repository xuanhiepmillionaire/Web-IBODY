using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class TaiKhoan
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string MatKhau { get; set; } = null!;

    public string? VaiTro { get; set; }

    public string? TrangThai { get; set; }

    public string? ResetToken { get; set; }

    public DateTime? ResetTokenExpiry { get; set; }

    public virtual ICollection<BaoCaoViPham> BaoCaoViPhams { get; set; } = new List<BaoCaoViPham>();

    public virtual ICollection<ChuyenGium> ChuyenGia { get; set; } = new List<ChuyenGium>();

    public virtual ICollection<GoiDangKy> GoiDangKies { get; set; } = new List<GoiDangKy>();

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();

    public virtual ICollection<ThongBao> ThongBaos { get; set; } = new List<ThongBao>();

    public virtual ICollection<TinNhan> TinNhanNguoiGuis { get; set; } = new List<TinNhan>();

    public virtual ICollection<TinNhan> TinNhanNguoiNhans { get; set; } = new List<TinNhan>();
}
