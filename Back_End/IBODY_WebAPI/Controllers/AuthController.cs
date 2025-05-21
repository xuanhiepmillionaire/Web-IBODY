using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using IBODY_WebAPI.Models;
using System.Security.Claims;
using System.Text.Json;
using System.Net;

namespace IBODY_WebAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly FinalIbodyContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IEmailService _emailService;


        public AuthController(UserManager<ApplicationUser> userManager,
                              SignInManager<ApplicationUser> signInManager,
                              RoleManager<IdentityRole> roleManager,
                              FinalIbodyContext context,
                              IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _context = context;
            _emailService = emailService;
        }

        // //✅ Đăng ký
        // [HttpPost("register")]
        // public async Task<IActionResult> Register(RegisterDto dto)
        // {
        //     var user = new ApplicationUser
        //     {
        //         UserName = dto.Email,
        //         Email = dto.Email,
        //         FullName = dto.FullName,
        //         Gender = dto.Gender,
        //         Dob = dto.Dob,
        //     };

        //     var result = await _userManager.CreateAsync(user, dto.Password);
        //     if (!result.Succeeded)
        //         return BadRequest(result.Errors);

        //     //  Gán role Identity
        //     if (!await _roleManager.RoleExistsAsync("nguoi_dung"))
        //         await _roleManager.CreateAsync(new IdentityRole("nguoi_dung"));

        //     await _userManager.AddToRoleAsync(user, "nguoi_dung");

        //     //  THÊM VÀO BẢNG tài khoản để đồng bộ
        //     var taiKhoan = new TaiKhoan
        //     {
        //         Email = user.Email,
        //         MatKhau = "hashed_by_identity",
        //         VaiTro = "nguoi_dung",
        //         TrangThai = "hoat_dong"
        //     };

        //     _context.TaiKhoans.Add(taiKhoan);
        //     await _context.SaveChangesAsync();
        //     //THÊM VÀO BẢNG người dùngdùng để đồng bộ
        //     var nguoiDung = new NguoiDung
        //     {
        //         TaiKhoanId = taiKhoan.Id,
        //         HoTen = user.FullName,
        //         GioiTinh = user.Gender,
        //         NgaySinh = user.Dob,
        //         MucTieuTamLy = null
        //     };

        //     _context.NguoiDungs.Add(nguoiDung);
        //     await _context.SaveChangesAsync();
        //     return Ok(new { message = "Đăng ký thành công" });
        // }

        //  Đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var tk = await _context.TaiKhoans
                .FirstOrDefaultAsync(t => t.Email == dto.Email);

            if (tk == null)
                return Forbid("Tài khoản chưa được đăng ký đầy đủ trong hệ thống.");

            if (tk.TrangThai == "khoa")
                return Forbid("Tài khoản của bạn đã bị khóa.");

            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized(new { message = "Email không tồn tại." });

            var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!passwordValid)
                return Unauthorized(new { message = "Mật khẩu không đúng." });

            // ✅ Thực hiện đăng nhập (tạo cookie)
            await _signInManager.SignInAsync(user, isPersistent: false);

            var roles = await _userManager.GetRolesAsync(user);

            string? avatarUrl = null;
            if (roles.Contains("nguoi_dung"))
            {
                var nguoiDung = await _context.NguoiDungs.FirstOrDefaultAsync(nd => nd.TaiKhoanId == tk.Id);
                avatarUrl = nguoiDung?.AvatarUrl;
            }
            else if (roles.Contains("chuyen_gia"))
            {
                var chuyenGia = await _context.ChuyenGia.FirstOrDefaultAsync(cg => cg.TaiKhoanId == tk.Id);
                avatarUrl = chuyenGia?.AvatarUrl;
            }

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new
                {
                    taiKhoanId = tk.Id,
                    email = user.Email,
                    fullName = user.FullName,
                    roles = roles,
                    trangThai = tk.TrangThai,
                    avatarUrl = avatarUrl
                }
            });
        }





        [HttpPost("register")]
        public async Task<IActionResult> RegisterAdmin(RegisterDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                Gender = dto.Gender,
                Dob = dto.Dob,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Nếu vai trò không tồn tại thì tạo mới
            if (!await _roleManager.RoleExistsAsync(dto.VaiTro))
                await _roleManager.CreateAsync(new IdentityRole(dto.VaiTro));

            // Gán role vào Identity
            await _userManager.AddToRoleAsync(user, dto.VaiTro);

            // Đồng bộ với bảng tài khoản
            var taiKhoan = new TaiKhoan
            {
                Email = user.Email,
                MatKhau = "hashed_by_identity",
                VaiTro = dto.VaiTro,
                TrangThai = "hoat_dong"
            };

            _context.TaiKhoans.Add(taiKhoan);
            await _context.SaveChangesAsync();

            if (dto.VaiTro == "nguoi_dung")
            {
                var nguoiDung = new NguoiDung
                {
                    TaiKhoanId = taiKhoan.Id,
                    HoTen = user.FullName,
                    GioiTinh = user.Gender,
                    NgaySinh = user.Dob,
                    MucTieuTamLy = null
                };

                _context.NguoiDungs.Add(nguoiDung);
                await _context.SaveChangesAsync();
            }

            // Nếu là quản trị thì không thêm vào bảng NguoiDung mà chờ xử lý riêng nếu cần

            return Ok(new { message = $"Đăng ký thành công với vai trò {dto.VaiTro}" });
        }

    
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest model)
        {
            var user = await _context.TaiKhoans.FirstOrDefaultAsync(x => x.Email == model.Email);
            if (user == null)
                return NotFound("Email không tồn tại.");

            // Tạo token và lưu DB
            var token = Guid.NewGuid().ToString();
            user.ResetToken = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);
            await _context.SaveChangesAsync();

            // Soạn nội dung email chỉ chứa token (không chứa link)
            string emailContent = $@"
                <h3>Khôi phục mật khẩu</h3>
                <p>Mã xác nhận của bạn là:</p>
                <h2>{token}</h2>
                <p>Sao chép mã này và dán vào trang khôi phục mật khẩu để tiếp tục.</p>";

            await _emailService.SendEmailAsync(user.Email, "Mã xác nhận khôi phục mật khẩu", emailContent);

            return Ok("Mã xác nhận đã được gửi đến email của bạn.");
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest model)
        {
            var taiKhoan = await _context.TaiKhoans.FirstOrDefaultAsync(x =>
                x.ResetToken == model.Token && x.ResetTokenExpiry > DateTime.UtcNow);

            if (taiKhoan == null)
                return BadRequest("Token không hợp lệ hoặc đã hết hạn.");

            // ✅ Tìm user bên Identity
            var user = await _userManager.FindByEmailAsync(taiKhoan.Email);
            if (user == null)
                return BadRequest("Không tìm thấy người dùng trong Identity.");

            // ✅ Reset mật khẩu Identity
            var removePassword = await _userManager.RemovePasswordAsync(user);
            var addPassword = await _userManager.AddPasswordAsync(user, model.NewPassword);

            if (!addPassword.Succeeded)
                return BadRequest("Không thể cập nhật mật khẩu.");

            // ✅ Đồng bộ mật khẩu bảng riêng nếu bạn vẫn cần dùng
            taiKhoan.MatKhau = "hashed_by_identity";
            taiKhoan.ResetToken = null;
            taiKhoan.ResetTokenExpiry = null;
            await _context.SaveChangesAsync();

            return Ok("Mật khẩu đã được thay đổi thành công.");
        }

        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var redirectUrl = Url.Action("GoogleResponse", "Auth");
            var properties = _signInManager.ConfigureExternalAuthenticationProperties("Google", redirectUrl);
            return Challenge(properties, "Google");
        }

        [HttpGet("google/callback")]
        public async Task<IActionResult> GoogleResponse()
        {
            try
            {
                var info = await _signInManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    Console.WriteLine("❌ Không nhận được thông tin từ Google.");
                    return Redirect("http://localhost:5500/index.html?error=login_failed");
                }

                var signInResult = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);
                ApplicationUser user;

                if (!signInResult.Succeeded)
                {
                    var email = info.Principal.FindFirstValue(ClaimTypes.Email);
                    user = await _userManager.FindByEmailAsync(email);
                    if (user == null)
                    {
                        user = new ApplicationUser
                        {
                            UserName = email,
                            Email = email,
                            FullName = info.Principal.FindFirstValue(ClaimTypes.Name)
                        };

                        var createResult = await _userManager.CreateAsync(user);
                        if (!createResult.Succeeded)
                        {
                            Console.WriteLine("❌ Lỗi tạo ApplicationUser: " + string.Join(", ", createResult.Errors.Select(e => e.Description)));
                            return Redirect("http://localhost:5500/index.html?error=create_user_failed");
                        }

                        await _userManager.AddLoginAsync(user, info);
                        await _userManager.AddToRoleAsync(user, "nguoi_dung");

                        // 🔁 Tạo tài khoản trong bảng `tai_khoan`
                        var taiKhoan = new TaiKhoan
                        {
                            Email = user.Email,
                            MatKhau = "google_login",
                            VaiTro = "nguoi_dung",
                            TrangThai = "hoat_dong"
                        };
                        _context.TaiKhoans.Add(taiKhoan);
                        await _context.SaveChangesAsync();

                        // 🔁 Tạo bản ghi người dùng
                        var nguoiDung = new NguoiDung
                        {
                            TaiKhoanId = taiKhoan.Id,
                            HoTen = user.FullName,
                            GioiTinh = null,
                            NgaySinh = null,
                            MucTieuTamLy = null
                        };
                        _context.NguoiDungs.Add(nguoiDung);
                        await _context.SaveChangesAsync();
                    }
                }
                else
                {
                    user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
                }

                // 🔍 Lấy lại bản ghi tài khoản đồng bộ
                var tkSync = await _context.TaiKhoans.FirstOrDefaultAsync(x => x.Email == user.Email);
                if (tkSync == null)
                {
                    Console.WriteLine("❌ Không tìm thấy tài khoản đồng bộ.");
                    return Redirect("http://localhost:5500/index.html?error=account_not_found");
                }

                var roles = await _userManager.GetRolesAsync(user);
                var nguoiDungSync = await _context.NguoiDungs.FirstOrDefaultAsync(x => x.TaiKhoanId == tkSync.Id);

                var userData = new
                {
                    taiKhoanId = tkSync.Id,
                    email = user.Email,
                    fullName = user.FullName,
                    roles = roles,
                    trangThai = tkSync.TrangThai,
                    avatarUrl = nguoiDungSync?.AvatarUrl
                };

                var json = JsonSerializer.Serialize(userData);
                var base64 = WebUtility.UrlEncode(json);
                return Redirect($"http://localhost:5500/index.html?googleUser={base64}");
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ LỖI callback Google:\n" + ex.ToString());
                return Redirect("http://localhost:5500/index.html?error=server_error");
            }
        }



    }
    public class ForgotPasswordRequest
{
    public string Email { get; set; }
}
public class ResetPasswordRequest
{
    public string Token { get; set; }
    public string NewPassword { get; set; }
}



    // public class RegisterDto
    // {
    //     public string Email { get; set; } = null!;
    //     public string Password { get; set; } = null!;
    //     public string? FullName { get; set; }
    //     public string? Gender { get; set; }
    //     public DateTime? Dob { get; set; }
    // }

    public class LoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
    public class RegisterDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? FullName { get; set; }
    public string? Gender { get; set; }
    public DateTime? Dob { get; set; }

    public string VaiTro { get; set; } = "nguoi_dung"; 
}
}
