namespace ReactWebApi.Server.Models
{
    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;

        public int Id { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }
}
