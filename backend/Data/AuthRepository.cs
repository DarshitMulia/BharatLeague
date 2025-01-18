using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using backend.Models;
using BCrypt.Net;
using Microsoft.Extensions.Logging;

namespace backend.Data
{
    public class AuthRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<AuthRepository> _logger;

        public AuthRepository(IConfiguration configuration, ILogger<AuthRepository> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _logger = logger;
        }

        // SignUp method
        public async Task<bool> SignupAsync(SignUpUsers signupUser)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
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

                    _logger.LogInformation("User registered successfully: {Email}", signupUser.Email);
                    return true;
                }
                catch (SqlException ex) when (ex.Number == 2601 || ex.Number == 2627)
                {
                    _logger.LogWarning("Duplicate entry for email or username: {Email}", signupUser.Email);
                    return false;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during user signup for email: {Email}", signupUser.Email);
                    return false;
                }
            }
        }

        // Login method
        public async Task<LoginUsers> LoginAsync(string email, string password, string role)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                try
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

                                // Verify both password and role
                                if (BCrypt.Net.BCrypt.Verify(password, hashedPassword) && dbRole.Equals(role, StringComparison.OrdinalIgnoreCase))
                                {
                                    _logger.LogInformation("User login successful: {Email}", email);

                                    return new LoginUsers
                                    {
                                        UserId = Convert.ToInt32(reader["user_id"]),
                                        Email = email,
                                        Role = dbRole
                                    };
                                }
                                else
                                {
                                    _logger.LogWarning("Invalid password or role for email: {Email}", email);
                                }
                            }
                            else
                            {
                                _logger.LogWarning("User not found with email: {Email}", email);
                            }
                        }
                    }

                    return null;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during user login for email: {Email}", email);
                    return null;
                }
            }
        }
    }
}
