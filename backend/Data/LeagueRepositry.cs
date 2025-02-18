using Microsoft.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.Extensions.Configuration;

namespace backend.Data
{
    public class LeagueRepository
    {
        private readonly string _connectionString;

        public LeagueRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<bool> AddLeagueAsync(LeagueModel leagueModel)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_AddLeague", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", leagueModel.UserId);
                    command.Parameters.AddWithValue("@LeagueName", leagueModel.LeagueName);
                    command.Parameters.AddWithValue("@Country", leagueModel.Country);
                    command.Parameters.AddWithValue("@ImageUrl", leagueModel.ImageUrl);
                    command.Parameters.AddWithValue("@StartDate", leagueModel.StartDate);
                    command.Parameters.AddWithValue("@EndDate", leagueModel.EndDate);

                    await command.ExecuteNonQueryAsync();
                }

                return true;
            }
        }

        public async Task<List<LeagueModel>> GetAllLeaguesAsync()
        {
            var leagues = new List<LeagueModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_GetAllLeagues", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            leagues.Add(new LeagueModel
                            {
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                UserId = Convert.ToInt32(reader["user_id"]),
                                LeagueName = reader["leaguename"].ToString(),
                                Country = reader["country"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                StartDate = Convert.ToDateTime(reader["start_date"]),
                                EndDate = Convert.ToDateTime(reader["end_date"]),
                                Status = reader["status"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return leagues;
        }

        public async Task<LeagueModel?> GetLeagueByIdAsync(int leagueId)
        {
            LeagueModel? league = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_GetLeagueByID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@LeagueID", leagueId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            league = new LeagueModel
                            {
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                UserId = Convert.ToInt32(reader["user_id"]),
                                LeagueName = reader["leaguename"].ToString(),
                                Country = reader["country"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                StartDate = Convert.ToDateTime(reader["start_date"]),
                                EndDate = Convert.ToDateTime(reader["end_date"]),
                                Status = reader["status"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            };
                        }
                    }
                }
            }

            return league;
        }

        public async Task<LeagueModel> UpdateLeagueAsync(LeagueModel leagueModel)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_UpdateLeague", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@LeagueID", leagueModel.LeagueId);
                    command.Parameters.AddWithValue("@UserID", leagueModel.UserId);
                    command.Parameters.AddWithValue("@LeagueName", leagueModel.LeagueName);
                    command.Parameters.AddWithValue("@Country", leagueModel.Country);
                    command.Parameters.AddWithValue("@ImageUrl", leagueModel.ImageUrl);
                    command.Parameters.AddWithValue("@StartDate", leagueModel.StartDate);
                    command.Parameters.AddWithValue("@EndDate", leagueModel.EndDate);

                    await command.ExecuteNonQueryAsync();
                }

                return leagueModel;
            }
        }

        public async Task<List<LeagueModel>> GetLeaguesByUserAsync(int userId)
        {
            var leagues = new List<LeagueModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_GetLeaguesByUser", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", userId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            leagues.Add(new LeagueModel
                            {
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                UserId = Convert.ToInt32(reader["user_id"]),
                                LeagueName = reader["leaguename"].ToString(),
                                Country = reader["country"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                StartDate = Convert.ToDateTime(reader["start_date"]),
                                EndDate = Convert.ToDateTime(reader["end_date"]),
                                Status = reader["status"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return leagues;
        }

        public async Task<List<LeagueModel>> GetOngoingLeaguesAsync()
        {
            var leagues = new List<LeagueModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_GetOngoingLeagues", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            leagues.Add(new LeagueModel
                            {
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                UserId = Convert.ToInt32(reader["user_id"]),
                                LeagueName = reader["leaguename"].ToString(),
                                Country = reader["country"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                StartDate = Convert.ToDateTime(reader["start_date"]),
                                EndDate = Convert.ToDateTime(reader["end_date"]),
                                Status = reader["status"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return leagues;
        }

        public async Task<List<LeagueModel>> SearchLeaguesAsync(string searchTerm)
        {
            var leagues = new List<LeagueModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_SearchLeagues", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@SearchTerm", searchTerm);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            leagues.Add(new LeagueModel
                            {
                                LeagueId = Convert.ToInt32(reader["league_id"]),
                                UserId = Convert.ToInt32(reader["user_id"]),
                                LeagueName = reader["leaguename"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                Country = reader["country"].ToString(),
                                StartDate = Convert.ToDateTime(reader["start_date"]),
                                EndDate = Convert.ToDateTime(reader["end_date"]),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return leagues;
        }
    }
}
