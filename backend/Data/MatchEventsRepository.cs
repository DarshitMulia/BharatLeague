using System.Data;
using backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace backend.Data
{
    public class MatchEventsRepository
    {
        private readonly string _connectionString;

        public MatchEventsRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<bool> AddMatchEventAsync(MatchEventsModel matchEvent)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_AddMatchEvent", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@match_id", matchEvent.MatchId);
                    command.Parameters.AddWithValue("@team_id", matchEvent.TeamId);

                    if (matchEvent.PlayerId.HasValue)
                        command.Parameters.AddWithValue("@player_id", matchEvent.PlayerId.Value);
                    else
                        command.Parameters.AddWithValue("@player_id", DBNull.Value);

                    command.Parameters.AddWithValue("@event_type", matchEvent.EventType);
                    command.Parameters.AddWithValue("@event_time", matchEvent.EventTime);

                    if (!string.IsNullOrWhiteSpace(matchEvent.AdditionalInfo))
                        command.Parameters.AddWithValue("@additional_info", matchEvent.AdditionalInfo);
                    else
                        command.Parameters.AddWithValue("@additional_info", DBNull.Value);

                    await command.ExecuteNonQueryAsync();
                }
                return true;
            }
        }

        public async Task<List<MatchEventsModel>> GetMatchEventsByMatchIdAsync(int matchId)
        {
            var events = new List<MatchEventsModel>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_GetMatchEventsByMatchId", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@match_id", matchId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            events.Add(new MatchEventsModel
                            {
                                EventId = Convert.ToInt32(reader["event_id"]),
                                MatchId = Convert.ToInt32(reader["match_id"]),
                                TeamId = Convert.ToInt32(reader["team_id"]),
                                PlayerId = reader["player_id"] != DBNull.Value ? (int?)Convert.ToInt32(reader["player_id"]) : null,
                                EventType = reader["event_type"].ToString(),
                                EventTime = Convert.ToInt32(reader["event_time"]),
                                AdditionalInfo = reader["additional_info"] != DBNull.Value ? reader["additional_info"].ToString() : null,
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return events;
        }

        public async Task<bool> DeleteMatchEventAsync(int eventId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("PR_DeleteMatchEvent", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@event_id", eventId);
                    await command.ExecuteNonQueryAsync();
                }
                return true;
            }
        }
    }
}
