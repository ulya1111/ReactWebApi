using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactWebApi.Server.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public byte[] PasswordHash { get; set; } = new byte[0];

        [Required]
        public byte[] PasswordSalt { get; set; } = new byte[0];
        public DateTime? LastLoginDate { get; set; }
    }
}
