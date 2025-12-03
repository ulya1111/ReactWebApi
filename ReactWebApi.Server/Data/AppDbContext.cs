using Microsoft.EntityFrameworkCore;
using ReactWebApi.Server.Models;
using System;

namespace ReactWebApi.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Item> Items => Set<Item>();
    }
}
