using System;
using System.Collections.Generic;

namespace IBODY_WebAPI.Models;

public partial class TheChuyenGium
{
    public int Id { get; set; }

    public int? ChuyenGiaId { get; set; }

    public int? TheId { get; set; }

    public virtual ChuyenGium? ChuyenGia { get; set; }

}
