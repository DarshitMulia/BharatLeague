using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using backend.Models;
using Microsoft.Extensions.Configuration;

namespace backend.Data
{
    public class LeagueStandingsRepository
    {
        private readonly string _connectionString;

        public LeagueStandingsRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<LeagueStandingsModel>> GetLeagueStandingsAsync(int leagueId)
        {
            var standings = new List<LeagueStandingsModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetLeagueStandingsOfALeague", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@league_id", leagueId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var standing = new LeagueStandingsModel
                            {
                                StandingId = Convert.ToInt32(reader["standing_id"]),
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                TeamId = Convert.ToInt32(reader["team_id"]),
                                TeamName = reader["TeamName"].ToString(),
                                MatchesPlayed = Convert.ToInt32(reader["matches_played"]),
                                Wins = Convert.ToInt32(reader["wins"]),
                                Losses = Convert.ToInt32(reader["losses"]),
                                Draws = Convert.ToInt32(reader["draws"]),
                                GoalsScored = Convert.ToInt32(reader["goals_scored"]),
                                GoalsConceded = Convert.ToInt32(reader["goals_conceded"]),
                                GoalsDifference = Convert.ToInt32(reader["goals_difference"]),
                                Points = Convert.ToInt32(reader["points"]),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            };

                            standings.Add(standing);
                        }
                    }
                }
            }

            return standings;
        }
    }
}
