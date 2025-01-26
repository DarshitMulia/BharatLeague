namespace backend.Models
{
    public class LeagueModel
    {
        public int LeagueId { get; set; }
        public int UserId { get; set; }
        public string LeagueName { get; set; }
        public string Country { get; set; }
        public string ImageUrl { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
