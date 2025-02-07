using System;

namespace backend.Models
{
    public class MatchModel
    {
        public int MatchId { get; set; }
        public int LeagueId { get; set; }
        public int Team1Id { get; set; }
        public int Team2Id { get; set; }
        public DateTime MatchDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public string Venue { get; set; }
        public string Status { get; set; } 
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
