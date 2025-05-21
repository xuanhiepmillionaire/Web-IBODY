using Microsoft.AspNetCore.Identity;

namespace IBODY_WebAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
        public string? Gender { get; set; }
        public DateTime? Dob { get; set; }
    }
}
