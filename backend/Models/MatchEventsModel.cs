using System;

namespace backend.Models
{
    public class MatchEventsModel
    {
        public int EventId { get; set; }
        public int MatchId { get; set; }
        public int TeamId { get; set; }
        public int? PlayerId { get; set; }
        public string EventType { get; set; }
        public int EventTime { get; set; }
        public string AdditionalInfo { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
