using Microsoft.Data.SqlClient;
using System.Data;
using backend.Models;
using Microsoft.Extensions.Configuration;

namespace backend.Data
{
    public class MatchRepository
    {
        private readonly string _connectionString;

        public MatchRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<bool> AddMatchAsync(MatchModel match)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
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
        }

        public async Task<MatchModel?> UpdateMatchAsync(MatchModel match)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
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
        }

        public async Task<List<MatchModel>> GetAllMatchesAsync()
        {
            var matches = new List<MatchModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetAllMatches", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
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
                                StartTime = TimeSpan.Parse(reader["start_time"].ToString()),
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
                                StartTime = reader["start_time"] != DBNull.Value ? (TimeSpan)reader["start_time"] : TimeSpan.Zero,
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

        public async Task<bool> MarkMatchOngoingAsync(int matchId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_MarkMatchOngoing", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@match_id", matchId);
                    await command.ExecuteNonQueryAsync();
                }
                return true;
            }
        }

        public async Task<List<MatchModel>> GetOngoingMatchesAsync()
        {
            var matches = new List<MatchModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetOngoingMatches", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
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
                                StartTime = reader["start_time"] != DBNull.Value ? (TimeSpan)reader["start_time"] : TimeSpan.Zero,
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

        public async Task<List<MatchModel>> GetScheduledMatchesByLeagueAsync(int leagueId)
        {
            var matches = new List<MatchModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetScheduledMatchesByLeague", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@leagueId", leagueId);
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
                                StartTime = reader["start_time"] != DBNull.Value ? (TimeSpan)reader["start_time"] : TimeSpan.Zero,
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

        public async Task<List<MatchModel>> GetOngoingMatchesByLeagueAsync(int leagueId)
        {
            var matches = new List<MatchModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetOngoingMatchesByLeague", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@leagueId", leagueId);
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
                                StartTime = reader["start_time"] != DBNull.Value ? (TimeSpan)reader["start_time"] : TimeSpan.Zero,
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

        public async Task<List<MatchModel>> GetCompletedMatchesByLeagueAsync(int leagueId)
        {
            var matches = new List<MatchModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetCompletedMatchesByLeague", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@leagueId", leagueId);
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
                                StartTime = reader["start_time"] != DBNull.Value ? (TimeSpan)reader["start_time"] : TimeSpan.Zero,
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
                                StartTime = reader["start_time"] != DBNull.Value ? (TimeSpan)reader["start_time"] : TimeSpan.Zero,
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

        public async Task<List<MatchModel>> SearchMatchesAsync(string? teamName, string? venue)
        {
            var matches = new List<MatchModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_SearchMatches", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@TeamName",
                        !string.IsNullOrEmpty(teamName) ? (object)teamName : DBNull.Value);
                    command.Parameters.AddWithValue("@Venue",
                        !string.IsNullOrEmpty(venue) ? (object)venue : DBNull.Value);

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
                                StartTime = reader["start_time"] != DBNull.Value ? (TimeSpan)reader["start_time"] : TimeSpan.Zero,
                                Venue = reader["venue"].ToString(),
                                Status = reader["status"].ToString()
                            });
                        }
                    }
                }
            }
            return matches;
        }
    }
}
