namespace backend.Models
{
    public class TeamModel
    {
        public int TeamId { get; set; }
        public int LeagueId { get; set; }
        public string TeamName { get; set; }
        public string ImageUrl { get; set; }
        public string City { get; set; }
        public string CoachName { get; set; }
        public int FoundedYear { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}