using System.Data;
using backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace backend.Data
{
    public class PlayerStatisticsRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<PlayerStatisticsRepository> _logger;

        public PlayerStatisticsRepository(IConfiguration configuration, ILogger<PlayerStatisticsRepository> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _logger = logger;
        }

        public async Task<bool> UpdatePlayerStatisticsAsync(int playerId, string eventType, bool incrementMatch)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand("PR_UpdatePlayerStatistics", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@player_id", playerId);
                        command.Parameters.AddWithValue("@event_type", eventType);
                        // Stored procedure expects BIT (0 or 1)
                        command.Parameters.AddWithValue("@increment_match", incrementMatch ? 1 : 0);

                        await command.ExecuteNonQueryAsync();
                    }
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error updating player statistics: {ex.Message}");
                    return false;
                }
            }
        }

        public async Task<bool> IncrementMatchesPlayedAndMarkMatchCompletedAsync(int matchId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
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
                catch (Exception ex)
                {
                    _logger.LogError($"Error updating match and player statistics: {ex.Message}");
                    return false;
                }
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
                try
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
                catch (Exception ex)
                {
                    _logger.LogError($"Error retrieving match statistics for player {playerId} in match {matchId}: {ex.Message}");
                }
            }
            return stats;
        }

        public async Task<PlayerStatisticsModel> GetPlayerStatisticsByPlayerIdAsync(int playerId)
        {
            PlayerStatisticsModel stats = null;
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
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
                                    PlayerId = Convert.ToInt32(reader["player_id"]),
                                    MatchesPlayed = Convert.ToInt32(reader["matches_played"]),
                                    Goals = Convert.ToInt32(reader["goals"]),
                                    Assists = Convert.ToInt32(reader["assists"]),
                                    YellowCards = Convert.ToInt32(reader["yellow_cards"]),
                                    RedCards = Convert.ToInt32(reader["red_cards"]),
                                    Fouls = Convert.ToInt32(reader["fouls"]),
                                    CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                    UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                                };
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error retrieving overall statistics for player {playerId}: {ex.Message}");
                }
            }
            return stats;
        }
    }
}
