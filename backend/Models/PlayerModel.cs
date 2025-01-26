namespace backend.Models
{
    public class PlayerModel
    {
        public int PlayerId { get; set; }
        public int TeamId { get; set; }
        public string PlayerName { get; set; }
        public string ImageUrl { get; set; }
        public int Age { get; set; }
        public int JerseyNumber { get; set; }
        public string Position { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
