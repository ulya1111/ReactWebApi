using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWebApi.Server.Data;
using ReactWebApi.Server.Models;
using System.Text.Json;

namespace ReactWebApi.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TableController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TableController(AppDbContext context) { _context = context; }

        [HttpGet("{tableName}")]
        public async Task<IActionResult> GetTableData(string tableName)
        {
            object? data = tableName.ToLower() switch
            {
                "items" => await _context.Items.ToListAsync(),
                "users" => await _context.Users.ToListAsync(),
                "orders" => await _context.Orders.ToListAsync(),
                _ => null
            };
            if (data == null) return NotFound($"Таблица '{tableName}' не найдена.");
            return Ok(data);
        }

        [HttpPut("{tableName}/{id}")]
        public async Task<IActionResult> UpdateTableRow(string tableName, string id, [FromBody] JsonElement updates)
        {
            switch (tableName.ToLower())
            {
                case "items":
                    if (!long.TryParse(id, out var itemId)) return BadRequest("Неверный формат ID.");
                    var item = await _context.Items.FindAsync(itemId);
                    if (item == null) return NotFound();
                    foreach (var property in updates.EnumerateObject())
                    {
                        if (string.Equals(property.Name, "name", StringComparison.OrdinalIgnoreCase)) item.Name = property.Value.GetString() ?? "";
                        else if (string.Equals(property.Name, "value", StringComparison.OrdinalIgnoreCase)) item.Value = property.Value.GetString();
                    }
                    _context.Entry(item).State = EntityState.Modified;
                    break;
                case "users":
                    if (!int.TryParse(id, out var userId)) return BadRequest("Неверный формат ID.");
                    var user = await _context.Users.FindAsync(userId);
                    if (user == null) return NotFound();
                    foreach (var property in updates.EnumerateObject())
                    {
                        if (string.Equals(property.Name, "username", StringComparison.OrdinalIgnoreCase)) user.Username = property.Value.GetString() ?? "";
                    }
                    _context.Entry(user).State = EntityState.Modified;
                    break;
                case "orders":
                    if (!int.TryParse(id, out var orderId)) return BadRequest("Неверный формат ID.");
                    var order = await _context.Orders.FindAsync(orderId);
                    if (order == null) return NotFound();
                    foreach (var property in updates.EnumerateObject())
                    {
                        if (string.Equals(property.Name, "item", StringComparison.OrdinalIgnoreCase)) order.Item = property.Value.GetString() ?? "";
                        else if (string.Equals(property.Name, "quantity", StringComparison.OrdinalIgnoreCase) && property.Value.TryGetInt32(out var qty)) order.Quantity = qty;
                        else if (string.Equals(property.Name, "status", StringComparison.OrdinalIgnoreCase)) order.Status = property.Value.GetString();
                    }
                    _context.Entry(order).State = EntityState.Modified;
                    break;
                default: return NotFound($"Таблица '{tableName}' не найдена.");
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{tableName}")]
        public async Task<IActionResult> CreateTableRow(string tableName, [FromBody] JsonElement newRowData)
        {
            object newEntity;

            switch (tableName.ToLower())
            {
                case "items":
                    var newItem = new Item();
                    if (newRowData.TryGetProperty("name", out var name)) newItem.Name = name.GetString() ?? "";
                    if (newRowData.TryGetProperty("value", out var value)) newItem.Value = value.GetString();
                    if (string.IsNullOrEmpty(newItem.Name)) return BadRequest("Поле 'Название' обязательно для заполнения.");
                    _context.Items.Add(newItem);
                    newEntity = newItem;
                    break;

                case "users":
                    var newUser = new User();
                    if (newRowData.TryGetProperty("username", out var username)) newUser.Username = username.GetString() ?? "";
                    if (string.IsNullOrEmpty(newUser.Username)) return BadRequest("Поле 'Название' обязательно для заполнения.");
                    _context.Users.Add(newUser);
                    newEntity = newUser;
                    break;

                case "orders":
                    var newOrder = new Order();
                    if (newRowData.TryGetProperty("item", out var itemProp)) newOrder.Item = itemProp.GetString() ?? "";
                    if (newRowData.TryGetProperty("quantity", out var qtyProp))
                    {
                        string? qtyString = qtyProp.GetString();
                        if (int.TryParse(qtyString, out int qtyInt)) newOrder.Quantity = qtyInt;
                    }
                    if (newRowData.TryGetProperty("status", out var statusProp)) newOrder.Status = statusProp.GetString();
                    if (string.IsNullOrEmpty(newOrder.Item)) return BadRequest("Поле 'Предметы' обязательно для заполнения.");
                    _context.Orders.Add(newOrder);
                    newEntity = newOrder;
                    break;

                default:
                    return NotFound($"Таблица '{tableName}' не найдена.");
            }

            await _context.SaveChangesAsync();

            
            return CreatedAtAction(nameof(GetTableData), new { tableName = tableName }, newEntity);
        }

        [HttpDelete("{tableName}/{id}")]
        public async Task<IActionResult> DeleteTableRow(string tableName, string id)
        {
            switch (tableName.ToLower())
            {
                case "items":
                    if (!long.TryParse(id, out var itemId)) return BadRequest("Неверный формат ID.");
                    var item = await _context.Items.FindAsync(itemId);
                    if (item == null) return NotFound();
                    _context.Items.Remove(item);
                    break;
                case "users":
                    if (!int.TryParse(id, out var userId)) return BadRequest("Неверный формат ID.");
                    var user = await _context.Users.FindAsync(userId);
                    if (user == null) return NotFound();
                    _context.Users.Remove(user);
                    break;
                case "orders":
                    if (!int.TryParse(id, out var orderId)) return BadRequest("Неверный формат ID.");
                    var order = await _context.Orders.FindAsync(orderId);
                    if (order == null) return NotFound();
                    _context.Orders.Remove(order);
                    break;
                default:
                    return NotFound($"Таблица '{tableName}' не найдена.");
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
