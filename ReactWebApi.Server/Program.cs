using Microsoft.EntityFrameworkCore;
using ReactWebApi.Server.Data;
using ReactWebApi.Server.Models;
using System;

var builder = WebApplication.CreateBuilder(args);


// SQLite
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlite("Data Source=items.db"));

builder.Services.AddCors(opts =>
{
    opts.AddPolicy("Default", p =>
        p.AllowAnyOrigin()
         .AllowAnyHeader()
         .AllowAnyMethod());
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseCors("Default");

app.UseHttpsRedirection();
app.UseRouting();

app.UseStaticFiles();

app.MapControllers();

app.MapFallbackToFile("index.html");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.Migrate();

    if (!db.Items.Any())
    {
        db.Items.AddRange(
            new Item
            {
                Name = "Clean Code",
                Value = "Robert C. Martin (Best practices for writing clean, maintainable code)"
            },
            new Item
            {
                Name = "Design Patterns",
                Value = "Erich Gamma et al. (Classic book about software architecture patterns)"
            },
            new Item
            {
                Name = "The Pragmatic Programmer",
                Value = "Andrew Hunt & David Thomas"
            }
        );

        db.SaveChanges();
    }
}


app.Run();

