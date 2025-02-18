using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using backend.Models;
using BCrypt.Net;

namespace backend.Data
{
    public class UsersRepository
    {
        private readonly string _connectionString;

        public UsersRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<bool> SignupAsync(SignUpUsers signupUser)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(signupUser.Password);

                using (SqlCommand command = new SqlCommand("PR_SignUpUser", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Username", signupUser.Username);
                    command.Parameters.AddWithValue("@Email", signupUser.Email);
                    command.Parameters.AddWithValue("@Password", hashedPassword);
                    command.Parameters.AddWithValue("@Role", signupUser.Role);

                    await command.ExecuteNonQueryAsync();
                }

                return true;
            }
        }

        public async Task<LoginUsers> LoginAsync(string email, string password, string role)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_LoginUser", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Email", email);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            string hashedPassword = reader["password"].ToString();
                            string dbRole = reader["role"].ToString();

                            if (BCrypt.Net.BCrypt.Verify(password, hashedPassword) &&
                                dbRole.Equals(role, StringComparison.OrdinalIgnoreCase))
                            {
                                return new LoginUsers
                                {
                                    UserId = Convert.ToInt32(reader["user_id"]),
                                    Email = email,
                                    Role = dbRole
                                };
                            }
                        }
                    }
                }

                return null;
            }
        }

        public async Task<bool> CheckIfEmailExistsAsync(string email)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("SELECT COUNT(*) FROM Users WHERE Email = @Email", connection))
                {
                    command.Parameters.AddWithValue("@Email", email);
                    int count = (int)await command.ExecuteScalarAsync();
                    return count > 0;
                }
            }
        }

        public async Task<bool> CheckPasswordAsync(string email, string password, string role)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand("PR_LoginUser", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Email", email);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            string hashedPassword = reader["password"].ToString();
                            string dbRole = reader["role"].ToString();

                            if (dbRole.Equals(role, StringComparison.OrdinalIgnoreCase) &&
                                BCrypt.Net.BCrypt.Verify(password, hashedPassword))
                            {
                                return true;
                            }
                        }
                    }
                }

                return false;
            }
        }

        public async Task<List<UsersModel>> GetAllUsersAsync()
        {
            var users = new List<UsersModel>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("PR_GetAllUsers", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            users.Add(new UsersModel
                            {
                                UserId = Convert.ToInt32(reader["user_id"]),
                                Username = reader["username"].ToString(),
                                Email = reader["email"].ToString(),
                                Role = reader["role"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return users;
        }

        public async Task<UsersModel?> GetUserByIdAsync(int userId)
        {
            UsersModel? user = null;

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("PR_GetUserByID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", userId);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            user = new UsersModel
                            {
                                UserId = Convert.ToInt32(reader["user_id"]),
                                Username = reader["username"].ToString(),
                                Email = reader["email"].ToString(),
                                Role = reader["role"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            };
                        }
                    }
                }
            }

            return user;
        }

        public async Task<List<UsersModel>> SearchUsersAsync(string searchTerm)
        {
            var users = new List<UsersModel>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("PR_SearchUsers", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@SearchTerm", searchTerm);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            users.Add(new UsersModel
                            {
                                UserId = Convert.ToInt32(reader["user_id"]),
                                Username = reader["username"].ToString(),
                                Email = reader["email"].ToString(),
                                Role = reader["role"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["created_at"]),
                                UpdatedAt = Convert.ToDateTime(reader["updated_at"])
                            });
                        }
                    }
                }
            }

            return users;
        }
    }
}
