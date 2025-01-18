using backend.Data;
using backend.Models;
using backend.Validator;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.Tasks;
using System;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthRepository _usersRepository;
        private readonly SignUpUsersValidator _signUpValidator;
        private readonly LoginUsersValidator _loginValidator;
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;

        public AuthController(AuthRepository usersRepository,
                               SignUpUsersValidator signUpValidator,
                               LoginUsersValidator loginValidator,
                               ILogger<AuthController> logger,
                               IConfiguration configuration)
        {
            _usersRepository = usersRepository;
            _signUpValidator = signUpValidator;
            _loginValidator = loginValidator;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpUsers signupUser)
        {
            var validationResult = await _signUpValidator.ValidateAsync(signupUser);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Sign-up validation failed: {Errors}", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }

            var result = await _usersRepository.SignupAsync(signupUser);
            if (result)
            {
                _logger.LogInformation("User registered successfully: {Username}", signupUser.Username);
                return Ok(new { message = "User registered successfully." });
            }

            _logger.LogError("Error during user registration for {Username}", signupUser.Username);
            return Conflict(new { message = "User already exists or an error occurred." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUsers loginUser)
        {
            var validationResult = await _loginValidator.ValidateAsync(loginUser);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Login validation failed: {Errors}", validationResult.Errors);
                return BadRequest(validationResult.Errors);
            }

            // Pass the role to the repository for validation
            var user = await _usersRepository.LoginAsync(loginUser.Email, loginUser.Password, loginUser.Role);
            if (user != null)
            {
                _logger.LogInformation("Login successful for user: {Email}", loginUser.Email);

                var token = GenerateJwtToken(user);

                return Ok(new { message = "Login successful", token });
            }

            _logger.LogWarning("Invalid login attempt for email: {Email}", loginUser.Email);
            return Unauthorized(new { message = "Invalid email, password, or role." });
        }

        private string GenerateJwtToken(LoginUsers user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString())
            };

            var token = new JwtSecurityToken(
                _configuration["JwtSettings:Issuer"],
                _configuration["JwtSettings:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(double.Parse(_configuration["JwtSettings:ExpirationInMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
