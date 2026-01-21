using Microsoft.EntityFrameworkCore;
using ReactWebApi.Server.Models;

namespace ReactWebApi.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Item> Items => Set<Item>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Order> Orders => Set<Order>();
    }
}
