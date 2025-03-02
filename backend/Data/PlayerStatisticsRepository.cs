using System.Data;
using backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace backend.Data
{
    public class PlayerStatisticsRepository
    {
        private readonly string _connectionString;

        public PlayerStatisticsRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<bool> UpdatePlayerStatisticsAsync(int playerId, string eventType, bool incrementMatch)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_UpdatePlayerStatistics", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@player_id", playerId);
                    command.Parameters.AddWithValue("@event_type", eventType);
                    command.Parameters.AddWithValue("@increment_match", incrementMatch ? 1 : 0);
                    await command.ExecuteNonQueryAsync();
                }
                return true;
            }
        }

        public async Task<bool> IncrementMatchesPlayedAndMarkMatchCompletedAsync(int matchId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_IncrementMatchesPlayedAndMarkTheMatchStatusAsCompletedAsWellAsUpdateLeagueStandings", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@match_id", matchId);
                    await command.ExecuteNonQueryAsync();
                }
                return true;
            }
        }

        public class PlayerMatchStatisticsDto
        {
            public int PlayerId { get; set; }
            public int MatchId { get; set; }
            public int Goals { get; set; }
            public int Assists { get; set; }
            public int YellowCards { get; set; }
            public int RedCards { get; set; }
            public int Fouls { get; set; }
        }

        public async Task<PlayerMatchStatisticsDto> GetPlayerStatisticsByMatchIdAsync(int matchId, int playerId)
        {
            PlayerMatchStatisticsDto stats = null;
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetPlayerStatisticsByMatchId", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@match_id", matchId);
                    command.Parameters.AddWithValue("@player_id", playerId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            stats = new PlayerMatchStatisticsDto
                            {
                                PlayerId = Convert.ToInt32(reader["player_id"]),
                                MatchId = Convert.ToInt32(reader["match_id"]),
                                Goals = Convert.ToInt32(reader["Goals"]),
                                Assists = Convert.ToInt32(reader["Assists"]),
                                YellowCards = Convert.ToInt32(reader["YellowCards"]),
                                RedCards = Convert.ToInt32(reader["RedCards"]),
                                Fouls = Convert.ToInt32(reader["Fouls"])
                            };
                        }
                    }
                }
            }
            return stats;
        }

        // Helper method to safely convert DB value to int
        private int GetIntValue(object dbValue)
        {
            return dbValue != DBNull.Value ? Convert.ToInt32(dbValue) : 0;
        }
        public async Task<PlayerStatisticsModel> GetPlayerStatisticsByPlayerIdAsync(int playerId)
        {
            PlayerStatisticsModel stats = null;
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetPlayerStatisticsByPlayerId", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@player_id", playerId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            stats = new PlayerStatisticsModel
                            {
                                PlayerName = reader["playername"].ToString(),
                                PlayerImage = reader["playerimage"].ToString(),
                                TeamName = reader["teamname"].ToString(),
                                TeamImage = reader["teamimage"].ToString(),
                                LeagueName = reader["leaguename"].ToString(),
                                LeagueImage = reader["leagueimage"].ToString(),
                                Age = GetIntValue(reader["age"]),
                                JerseyNumber = GetIntValue(reader["jersey_number"]),
                                Position = reader["position"].ToString(),
                                MatchesPlayed = GetIntValue(reader["matches_played"]),
                                Goals = GetIntValue(reader["goals"]),
                                Assists = GetIntValue(reader["assists"]),
                                YellowCards = GetIntValue(reader["yellow_cards"]),
                                RedCards = GetIntValue(reader["red_cards"]),
                                Fouls = GetIntValue(reader["fouls"])
                            };
                        }
                    }
                }
            }
            return stats;
        }
    }
}
