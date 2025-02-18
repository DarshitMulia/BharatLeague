using Microsoft.Data.SqlClient;
using System.Data;
using backend.Models;
using Microsoft.Extensions.Configuration;

namespace backend.Data
{
    public class TeamRepository
    {
        private readonly string _connectionString;

        public TeamRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<bool> AddTeamAsync(TeamModel teamModel)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_AddTeam", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@LeagueID", teamModel.LeagueId);
                    command.Parameters.AddWithValue("@TeamName", teamModel.TeamName);
                    command.Parameters.AddWithValue("@ImageUrl", teamModel.ImageUrl);
                    command.Parameters.AddWithValue("@City", teamModel.City);
                    command.Parameters.AddWithValue("@CoachName", teamModel.CoachName);
                    command.Parameters.AddWithValue("@FoundedYear", teamModel.FoundedYear);
                    await command.ExecuteNonQueryAsync();
                }
                return true;
            }
        }

        public async Task<TeamModel> UpdateTeamAsync(TeamModel teamModel)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_UpdateTeam", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@TeamID", teamModel.TeamId);
                    command.Parameters.AddWithValue("@LeagueID", teamModel.LeagueId);
                    command.Parameters.AddWithValue("@TeamName", teamModel.TeamName);
                    command.Parameters.AddWithValue("@ImageUrl", teamModel.ImageUrl);
                    command.Parameters.AddWithValue("@City", teamModel.City);
                    command.Parameters.AddWithValue("@CoachName", teamModel.CoachName);
                    command.Parameters.AddWithValue("@FoundedYear", teamModel.FoundedYear);
                    await command.ExecuteNonQueryAsync();
                }
                return teamModel;
            }
        }

        public async Task<List<TeamModel>> GetAllTeamsAsync()
        {
            var teams = new List<TeamModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetAllTeams", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            teams.Add(new TeamModel
                            {
                                TeamId = Convert.ToInt32(reader["team_id"]),
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                TeamName = reader["teamname"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                City = reader["city"].ToString(),
                                CoachName = reader["coach_name"].ToString(),
                                FoundedYear = Convert.ToInt32(reader["founded_year"]),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return teams;
        }

        public async Task<List<TeamModel>> GetTeamsByLeagueIdAsync(int leagueId)
        {
            var teams = new List<TeamModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetTeamsByLeagueID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@LeagueID", leagueId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            teams.Add(new TeamModel
                            {
                                TeamId = Convert.ToInt32(reader["team_id"]),
                                LeagueId = leagueId,
                                TeamName = reader["teamname"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                City = reader["city"].ToString(),
                                CoachName = reader["coach_name"].ToString(),
                                FoundedYear = Convert.ToInt32(reader["founded_year"]),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }
            return teams;
        }

        public async Task<List<TeamModel>> GetTeamsByMatchIdAsync(int matchId)
        {
            var teams = new List<TeamModel>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetTeamsByMatchID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@MatchID", matchId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            teams.Add(new TeamModel
                            {
                                TeamId = Convert.ToInt32(reader["team_id"]),
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                TeamName = reader["teamname"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                City = reader["city"].ToString(),
                                CoachName = reader["coach_name"].ToString(),
                                FoundedYear = Convert.ToInt32(reader["founded_year"]),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }
            return teams;
        }

        public async Task<TeamModel?> GetTeamByIdAsync(int teamId)
        {
            TeamModel? team = null;
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetTeamByID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@TeamID", teamId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            team = new TeamModel
                            {
                                TeamId = teamId,
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                TeamName = reader["teamname"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                City = reader["city"].ToString(),
                                CoachName = reader["coach_name"].ToString(),
                                FoundedYear = Convert.ToInt32(reader["founded_year"]),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            };
                        }
                    }
                }
            }
            return team;
        }

        public async Task<List<TeamModel>> SearchTeamsAsync(string searchTerm)
        {
            var teams = new List<TeamModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_SearchTeams", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@SearchTerm", searchTerm);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            teams.Add(new TeamModel
                            {
                                TeamId = Convert.ToInt32(reader["team_id"]),
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                TeamName = reader["teamname"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                City = reader["city"].ToString(),
                                CoachName = reader["coach_name"].ToString(),
                                FoundedYear = Convert.ToInt32(reader["founded_year"]),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }
            return teams;
        }
    }
}
