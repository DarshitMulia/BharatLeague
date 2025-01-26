using Microsoft.Data.SqlClient;
using System.Data;
using backend.Models;

namespace backend.Data
{
    public class TeamRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<TeamRepository> _logger;

        public TeamRepository(IConfiguration configuration, ILogger<TeamRepository> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _logger = logger;
        }

        public async Task<bool> AddTeamAsync(TeamModel teamModel)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
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
                catch
                {
                    return false;
                }
            }
        }

        public async Task<TeamModel> UpdateTeamAsync(TeamModel teamModel)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
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
                catch (SqlException sqlEx)
                {
                    _logger.LogError($"SQL error while updating league: {sqlEx.Message}");
                    throw new Exception("A database error occurred while updating the league.", sqlEx);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error while updating league: {ex.Message}");
                    throw new Exception("An unexpected error occurred while updating the league.", ex);
                }
            }
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
