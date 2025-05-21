using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class PhuongThucChung
{
    public int Id { get; set; }

    public string Ten { get; set; } = null!;

    public string? MoTa { get; set; }

    public string? TrangThai { get; set; }

    public virtual ICollection<GiaoDich> GiaoDiches { get; set; } = new List<GiaoDich>();
}
