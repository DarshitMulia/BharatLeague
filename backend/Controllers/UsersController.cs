using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;
using FluentValidation;
using FluentValidation.Results;
using System.Collections.Generic;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly UsersRepository _usersRepository;
        private readonly IConfiguration _configuration;
        private readonly IValidator<SignUpUsers> _signUpUsersValidator;
        private readonly IValidator<LoginUsers> _loginUsersValidator;

        public UsersController(UsersRepository usersRepository,
                               IConfiguration configuration,
                               IValidator<SignUpUsers> signUpUsersValidator,
                               IValidator<LoginUsers> loginUsersValidator)
        {
            _usersRepository = usersRepository;
            _configuration = configuration;
            _signUpUsersValidator = signUpUsersValidator;
            _loginUsersValidator = loginUsersValidator;
        }

        [HttpPost("signup")]
        [AllowAnonymous]
        public async Task<IActionResult> SignUp([FromBody] SignUpUsers signupUser)
        {
            ValidationResult validationResult = await _signUpUsersValidator.ValidateAsync(signupUser);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }
            await _usersRepository.SignupAsync(signupUser);
            return Ok(new { message = "User registered successfully." });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginUsers loginUser)
        {
            ValidationResult validationResult = await _loginUsersValidator.ValidateAsync(loginUser);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }
            var user = await _usersRepository.LoginAsync(loginUser.Email, loginUser.Password, loginUser.Role);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }
            var token = GenerateJwtToken(user);
            return Ok(new { message = "Login successful", user, token });
        }

        [HttpGet("getallusers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _usersRepository.GetAllUsersAsync();
            if (users == null || !users.Any())
            {
                return Ok(new List<UsersModel>());
            }
            return Ok(users);
        }

        [HttpGet("user/{userid}")]
        public async Task<IActionResult> GetUserById(int userid)
        {
            var user = await _usersRepository.GetUserByIdAsync(userid);
            if (user == null)
            {
                return Ok(new UsersModel());
            }
            return Ok(user);
        }

        [HttpGet("searchuser")]
        public async Task<IActionResult> SearchUsers([FromQuery] string searchTerm)
        {
            var users = await _usersRepository.SearchUsersAsync(searchTerm);
            if (users == null || !users.Any())
            {
                return Ok(new List<UsersModel>());
            }
            return Ok(users);
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
