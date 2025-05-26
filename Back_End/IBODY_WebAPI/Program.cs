// using IBODY_WebAPI.Models;
// using Microsoft.EntityFrameworkCore;
// using System.Text.Json.Serialization;
// using IBODY_WebAPI.Data;
// using IBODY_WebAPI.Helpers;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.Extensions.FileProviders;
// using IBODY_WebAPI.Services;
// using Microsoft.AspNetCore.SignalR;
// using Microsoft.AspNetCore.Authentication.Cookies;
// using Microsoft.AspNetCore.Authentication.Google;
// using Microsoft.AspNetCore.Authentication;
// using System.Security.Claims;




// var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
//     .AddEntityFrameworkStores<AppDbContext>()
//     .AddDefaultTokenProviders();

// builder.Services.ConfigureApplicationCookie(options =>
// {
//     options.LoginPath = "/api/auth/login";
//     options.AccessDeniedPath = "/api/auth/denied";
// });


//  builder.Services.AddDbContext<FinalIbodyContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// // ✅ Add CORS (cho phép frontend truy cập API)
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAll", policy =>
//     {
//         policy.AllowAnyOrigin()
//               .AllowAnyHeader()
//               .AllowAnyMethod();
//     });
// });

// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(policy =>
//     {
//         policy
//             .WithOrigins("http://127.0.0.1:5500") // hoặc http://localhost:5500 nếu bạn dùng VS Code Live Server
//             .AllowAnyHeader()
//             .AllowAnyMethod()
//             .AllowCredentials(); // BẮT BUỘC cho SignalR
//     });
// });



// // ✅ Add Controllers & JSON options
// builder.Services.AddControllers();

// // ✅ Add Swagger
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
// builder.Services.AddScoped<IEmailService, EmailService>();
// builder.Services.AddSingleton<ChatMessageService>();
// builder.Services.AddSignalR();

// builder.Services.AddSignalR()
//     .AddHubOptions<VideoCallHub>(options =>
//     {
//         options.ClientTimeoutInterval = TimeSpan.FromSeconds(60);
//     });

// builder.Services.AddSingleton<IUserIdProvider, NameIdentifierUserIdProvider>();

// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
// })
// .AddCookie()
// .AddGoogle("Google", options =>
// {
//     options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
//     options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
//     options.CallbackPath = "/api/auth/google/callback";
//     options.Scope.Add("profile");
//     options.Scope.Add("email");

//     options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "sub");
//     options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
//     options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
// });
// builder.Services.AddDistributedMemoryCache(); 
// builder.Services.AddSession(options =>
// {
//     options.IdleTimeout = TimeSpan.FromMinutes(10);
//     options.Cookie.HttpOnly = true;
//     options.Cookie.IsEssential = true;
// });

// BadWordsFilter.Load("Configs/badwords.json");

// var app = builder.Build();

// using (var scope = app.Services.CreateScope())
// {
//     var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

//     if (!await roleManager.RoleExistsAsync("quan_tri"))
//     {
//         var role = new IdentityRole("quan_tri");
//         await roleManager.CreateAsync(role);
//         Console.WriteLine("Vai trò 'quan_tri' đã được thêm thành công.");
//     }
// }

// app.UseStaticFiles(); // Cho wwwroot

// // Thêm cấu hình cho folder 'img'
// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(
//         Path.Combine(Directory.GetCurrentDirectory(), "img")),
//     RequestPath = "/img"
// });

// app.MapHub<VideoCallHub>("/videoCallHub");
// app.UseRouting();
// // ✅ Use middleware
// app.UseCors("AllowAll");
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();
// app.UseSession();
// // Nếu có dùng Authentication/Authorization thì mở lại
//  app.UseAuthentication();
//  app.UseAuthorization();

// app.MapControllers();


// app.Run();
using IBODY_WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using IBODY_WebAPI.Data;
using IBODY_WebAPI.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using IBODY_WebAPI.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Database contexts
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<FinalIbodyContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity setup
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Configure cookie settings for authentication
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/api/auth/login";
    options.AccessDeniedPath = "/api/auth/denied";
});

// Enable session and distributed cache (important for OAuth state)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(20);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Add Authentication with Google OAuth
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    options.CallbackPath = "/api/auth/google/callback";
});

// CORS configuration — customize origins as needed
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .WithOrigins("http://localhost:5500", "http://127.0.0.1:5500")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Controllers, SignalR, Swagger etc.
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSingleton<ChatMessageService>();
builder.Services.AddSingleton<IUserIdProvider, NameIdentifierUserIdProvider>();

var app = builder.Build();
BadWordsFilter.Load("badwords.json"); 
// Middleware pipeline — ORDER IS CRUCIAL
app.UseStaticFiles();

// Thêm cấu hình cho folder 'img'
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "img")),
    RequestPath = "/img"
});
app.UseRouting();

app.UseCors("AllowAll");

app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();
app.MapHub<VideoCallHub>("/videoCallHub");

app.Run();
