namespace ReactWebApi.Server.Models
{
    public class ChartData
    {
        public List<string> Labels { get; set; } = new List<string>();
        public List<int> Counts { get; set; } = new List<int>();
    }

    public class ReportDto
    {
        public ChartData? PieChart { get; set; }
        public ChartData? LineChart { get; set; }
    }
}
