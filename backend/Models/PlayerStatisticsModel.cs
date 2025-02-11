using System;

namespace backend.Models
{
    public class PlayerStatisticsModel
    {
        public string PlayerName { get; set; }
        public string PlayerImage { get; set; }
        public string TeamName { get; set; }
        public string TeamImage { get; set; }
        public string LeagueName { get; set; }
        public string LeagueImage { get; set; }
        public int Age { get; set; }
        public int JerseyNumber { get; set; }
        public string Position { get; set; }
        public int MatchesPlayed { get; set; }
        public int Goals { get; set; }
        public int Assists { get; set; }
        public int YellowCards { get; set; }
        public int RedCards { get; set; }
        public int Fouls { get; set; }
    }
}
