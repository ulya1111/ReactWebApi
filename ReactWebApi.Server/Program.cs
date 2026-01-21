using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReactWebApi.Server.Data;
using System.Text;


var builder = WebApplication.CreateBuilder(args);


// 1. PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Cors
builder.Services.AddCors(opts =>
{
    opts.AddPolicy("Default", p =>
        p.AllowAnyOrigin()
         .AllowAnyHeader()
         .AllowAnyMethod());
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 3.  JWT токен
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var appSettingsToken = builder.Configuration.GetSection("AppSettings:Token").Value;
        if (appSettingsToken is null)
            throw new Exception("AppSettings Token is null!");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettingsToken)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

app.UseCors("Default");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();


app.UseRouting();
app.UseStaticFiles();
app.MapControllers();
app.MapFallbackToFile("index.html");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}


app.Run();

