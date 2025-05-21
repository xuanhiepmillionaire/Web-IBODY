using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class ThoiGianRanhChuyenGium
{
    public int Id { get; set; }

    public int? ChuyenGiaId { get; set; }

    public int? ThuTrongTuan { get; set; }

    public TimeOnly? Tu { get; set; }

    public TimeOnly? Den { get; set; }

    public virtual ChuyenGium? ChuyenGia { get; set; }
}
