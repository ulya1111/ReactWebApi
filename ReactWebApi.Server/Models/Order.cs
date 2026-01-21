using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactWebApi.Server.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Item { get; set; } = string.Empty;

        [Required]
        public int Quantity { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; }
    }
}
