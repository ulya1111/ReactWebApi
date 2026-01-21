using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWebApi.Server.Data;
using ReactWebApi.Server.Models; // <-- Добавьте этот using

namespace ReactWebApi.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ReportController(AppDbContext context) { _context = context; }

        [HttpGet("{tableName}")]
        public async Task<IActionResult> GetReportData(string tableName)
        {
            var report = new ReportDto();

            switch (tableName.ToLower())
            {
                case "items":
                    var itemData = await _context.Items
                        .GroupBy(i => i.Value ?? "Без значения")
                        .Select(g => new { Label = g.Key, Count = g.Count() })
                        .ToListAsync();

                    report.PieChart = new ChartData
                    {
                        Labels = itemData.Select(d => d.Label).ToList(),
                        Counts = itemData.Select(d => d.Count).ToList()
                    };

                    var itemGrowth = await _context.Items
                        .OrderBy(i => i.Id)
                        .Select(i => new { Label = "ID " + i.Id, Count = 1 })
                        .ToListAsync();

                    report.LineChart = new ChartData
                    {
                        Labels = itemGrowth.Select(d => d.Label).ToList(),
                        Counts = itemGrowth.Select((d, index) => index + 1).ToList() 
                    };
                    break;

                case "users":
                    var userData = await _context.Users
                        .Select(u => new { Label = u.Username, Count = 1 })
                        .ToListAsync();

                    report.PieChart = new ChartData
                    {
                        Labels = userData.Select(d => d.Label).ToList(),
                        Counts = userData.Select(d => d.Count).ToList()
                    };

                    var loginActivity = await _context.Users
                        .Where(u => u.LastLoginDate != null)
                        .GroupBy(u => u.LastLoginDate.Value.Date)
                        .OrderBy(g => g.Key)
                        .Select(g => new { Label = g.Key.ToShortDateString(), Count = g.Count() })
                        .ToListAsync();

                    report.LineChart = new ChartData
                    {
                        Labels = loginActivity.Select(d => d.Label).ToList(),
                        Counts = loginActivity.Select(d => d.Count).ToList()
                    };
                    break;

                case "orders":
                    var orderPie = await _context.Orders
                        .GroupBy(o => o.Status ?? "Новый")
                        .Select(g => new { Label = g.Key, Count = g.Count() })
                        .ToListAsync();

                    report.PieChart = new ChartData
                    {
                        Labels = orderPie.Select(d => d.Label).ToList(),
                        Counts = orderPie.Select(d => d.Count).ToList()
                    };

                    var orderQty = await _context.Orders
                        .OrderBy(o => o.Id)
                        .Select(o => new { Label = o.Item, Count = o.Quantity })
                        .ToListAsync();

                    report.LineChart = new ChartData
                    {
                        Labels = orderQty.Select(d => d.Label).ToList(),
                        Counts = orderQty.Select(d => d.Count).ToList()
                    };
                    break;

                default:
                    return NotFound();
            }

            return Ok(report);
        }

    }
}
