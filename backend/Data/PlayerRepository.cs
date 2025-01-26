using Microsoft.Data.SqlClient;
using System.Data;
using backend.Models;

namespace backend.Data
{
    public class PlayerRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<TeamRepository> _logger;

        public PlayerRepository(IConfiguration configuration, ILogger<TeamRepository> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _logger = logger;
        }

        // Add a new player
        public async Task<bool> AddPlayerAsync(PlayerModel playerModel)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("PR_AddPlayer", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@TeamID", playerModel.TeamId);
                        command.Parameters.AddWithValue("@PlayerName", playerModel.PlayerName);
                        command.Parameters.AddWithValue("@ImageUrl", playerModel.ImageUrl ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Age", playerModel.Age);
                        command.Parameters.AddWithValue("@JerseyNumber", playerModel.JerseyNumber);
                        command.Parameters.AddWithValue("@Position", playerModel.Position);

                        await command.ExecuteNonQueryAsync();
                    }

                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }
        }

        public async Task<PlayerModel> UpdatePlayerAsync(PlayerModel playerModel)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("PR_UpdatePlayer", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@PlayerId", playerModel.TeamId);
                        command.Parameters.AddWithValue("@TeamId", playerModel.TeamId);
                        command.Parameters.AddWithValue("@PlayerName", playerModel.PlayerName);
                        command.Parameters.AddWithValue("@ImageUrl", playerModel.ImageUrl);
                        command.Parameters.AddWithValue("@Age", playerModel.Age);
                        command.Parameters.AddWithValue("@JerseyNumber", playerModel.JerseyNumber);
                        command.Parameters.AddWithValue("@Position", playerModel.Position);

                        await command.ExecuteNonQueryAsync();
                    }
                    return playerModel;
                }
                catch (SqlException sqlEx)
                {
                    _logger.LogError($"SQL error while updating player: {sqlEx.Message}");
                    throw new Exception("A database error occurred while updating the player.", sqlEx);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error while updating player: {ex.Message}");
                    throw new Exception("An unexpected error occurred while updating the player.", ex);
                }
            }
        }

        // Get all players
        public async Task<List<PlayerModel>> GetAllPlayersAsync()
        {
            var players = new List<PlayerModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_GetAllPlayers", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            players.Add(new PlayerModel
                            {
                                PlayerId = Convert.ToInt32(reader["player_id"]),
                                TeamId = Convert.ToInt32(reader["team_id"]),
                                PlayerName = reader["playername"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                Age = Convert.ToInt32(reader["age"]),
                                JerseyNumber = Convert.ToInt32(reader["jersey_number"]),
                                Position = reader["position"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return players;
        }

        // Get player by ID
        public async Task<PlayerModel?> GetPlayerByIdAsync(int playerId)
        {
            PlayerModel? player = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_GetPlayerByID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@PlayerID", playerId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            player = new PlayerModel
                            {
                                PlayerId = Convert.ToInt32(reader["player_id"]),
                                TeamId = Convert.ToInt32(reader["team_id"]),
                                PlayerName = reader["playername"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                Age = Convert.ToInt32(reader["age"]),
                                JerseyNumber = Convert.ToInt32(reader["jersey_number"]),
                                Position = reader["position"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            };
                        }
                    }
                }
            }

            return player;
        }

        // Get players by team
        public async Task<List<PlayerModel>> GetPlayersByTeamAsync(int teamId)
        {
            var players = new List<PlayerModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_GetPlayersByTeam", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@TeamID", teamId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            players.Add(new PlayerModel
                            {
                                PlayerId = Convert.ToInt32(reader["player_id"]),
                                TeamId = Convert.ToInt32(reader["team_id"]),
                                PlayerName = reader["playername"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                Age = Convert.ToInt32(reader["age"]),
                                JerseyNumber = Convert.ToInt32(reader["jersey_number"]),
                                Position = reader["position"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return players;
        }

        // Search players by name or position
        public async Task<List<PlayerModel>> SearchPlayersAsync(string searchTerm)
        {
            var players = new List<PlayerModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_SearchPlayers", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@SearchTerm", searchTerm);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            players.Add(new PlayerModel
                            {
                                PlayerId = Convert.ToInt32(reader["player_id"]),
                                TeamId = Convert.ToInt32(reader["team_id"]),
                                PlayerName = reader["playername"].ToString(),
                                ImageUrl = reader["image_url"].ToString(),
                                Age = Convert.ToInt32(reader["age"]),
                                JerseyNumber = Convert.ToInt32(reader["jersey_number"]),
                                Position = reader["position"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return players;
        }
    }
}
