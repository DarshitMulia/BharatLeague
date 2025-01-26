using Microsoft.Data.SqlClient;
using System.Data;
using backend.Models;

namespace backend.Data
{
    public class MatchRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<MatchRepository> _logger;

        public MatchRepository(IConfiguration configuration, ILogger<MatchRepository> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _logger = logger;
        }

        public async Task<bool> AddMatchAsync(MatchModel match)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand("PR_AddMatch", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@league_id", match.LeagueId);
                        command.Parameters.AddWithValue("@team1_id", match.Team1Id);
                        command.Parameters.AddWithValue("@team2_id", match.Team2Id);
                        command.Parameters.AddWithValue("@match_date", match.MatchDate);
                        command.Parameters.AddWithValue("@start_time", match.StartTime);
                        command.Parameters.AddWithValue("@venue", match.Venue);

                        await command.ExecuteNonQueryAsync();
                    }
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error adding match: {ex.Message}");
                    return false;
                }
            }
        }

        public async Task<MatchModel?> UpdateMatchAsync(MatchModel match)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand("PR_UpdateMatch", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@match_id", match.MatchId);
                        command.Parameters.AddWithValue("@league_id", match.LeagueId);
                        command.Parameters.AddWithValue("@team1_id", match.Team1Id);
                        command.Parameters.AddWithValue("@team2_id", match.Team2Id);
                        command.Parameters.AddWithValue("@match_date", match.MatchDate);
                        command.Parameters.AddWithValue("@start_time", match.StartTime);
                        command.Parameters.AddWithValue("@venue", match.Venue);
                        await command.ExecuteNonQueryAsync();
                    }
                    return match;
                }
                catch (SqlException sqlEx)
                {
                    _logger.LogError($"SQL error while updating match: {sqlEx.Message}");
                    throw new Exception("A database error occurred while updating the match.", sqlEx);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error while updating match: {ex.Message}");
                    throw new Exception("An unexpected error occurred while updating the match.", ex);
                }
            }
        }

        public async Task<List<MatchModel>> GetMatchesByLeagueIdAsync(int leagueId)
        {
            var matches = new List<MatchModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetMatchesByLeagueID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@league_id", leagueId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            matches.Add(new MatchModel
                            {
                                MatchId = Convert.ToInt32(reader["match_id"]),
                                LeagueId = leagueId,
                                Team1Id = Convert.ToInt32(reader["team1_id"]),
                                Team2Id = Convert.ToInt32(reader["team2_id"]),
                                MatchDate = Convert.ToDateTime(reader["match_date"]),
                                StartTime = Convert.ToDateTime(reader["start_time"]),
                                Venue = reader["venue"].ToString(),
                                Status = reader["status"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }
            return matches;
        }

        public async Task<MatchModel?> GetMatchByIdAsync(int matchId)
        {
            MatchModel? match = null;
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetMatchByID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@match_id", matchId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            match = new MatchModel
                            {
                                MatchId = matchId,
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                Team1Id = Convert.ToInt32(reader["team1_id"]),
                                Team2Id = Convert.ToInt32(reader["team2_id"]),
                                MatchDate = Convert.ToDateTime(reader["match_date"]),
                                StartTime = Convert.ToDateTime(reader["start_time"]),
                                Venue = reader["venue"].ToString(),
                                Status = reader["status"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            };
                        }
                    }
                }
            }
            return match;
        }

        public async Task<List<MatchModel>> SearchMatchesAsync(string searchTerm)
        {
            var matches = new List<MatchModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_SearchMatches", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@search", searchTerm);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            matches.Add(new MatchModel
                            {
                                MatchId = Convert.ToInt32(reader["match_id"]),
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                Team1Id = Convert.ToInt32(reader["team1_id"]),
                                Team2Id = Convert.ToInt32(reader["team2_id"]),
                                MatchDate = Convert.ToDateTime(reader["match_date"]),
                                StartTime = Convert.ToDateTime(reader["start_time"]),
                                Venue = reader["venue"].ToString(),
                                Status = reader["status"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return matches;
        }
    }
}
