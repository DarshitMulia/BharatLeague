using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.Validator;
using FluentValidation;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using backend.Services;
using System.Threading.Tasks;
using System.Linq;
using System;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlayerController : ControllerBase
    {
        private readonly PlayerRepository _playerRepository;
        private readonly PlayerValidator _playerValidator;
        private readonly CloudinaryService _cloudinaryService;

        public PlayerController(PlayerRepository playerRepository, PlayerValidator playerValidator, CloudinaryService cloudinaryService)
        {
            _playerRepository = playerRepository;
            _playerValidator = playerValidator;
            _cloudinaryService = cloudinaryService;
        }

        // DTO for handling image upload
        public class PlayerDto
        {
            public int PlayerId { get; set; }
            public int TeamId { get; set; }
            public string PlayerName { get; set; }
            public IFormFile ImageFile { get; set; }
            public int Age { get; set; }
            public int JerseyNumber { get; set; }
            public string Position { get; set; }
        }

        // Add a new player
        [HttpPost("addplayer")]
        public async Task<IActionResult> AddPlayer([FromForm] PlayerDto playerDto)
        {
            if (playerDto == null || playerDto.ImageFile == null)
                return BadRequest("Invalid data.");

            // Upload the image to Cloudinary
            var imageUrl = await _cloudinaryService.UploadImageAsync(playerDto.ImageFile);
            if (string.IsNullOrEmpty(imageUrl))
            {
                return StatusCode(500, "Image upload failed.");
            }

            // Map DTO to PlayerModel
            var playerModel = new PlayerModel
            {
                TeamId = playerDto.TeamId,
                PlayerName = playerDto.PlayerName,
                ImageUrl = imageUrl,  
                Age = playerDto.Age,
                JerseyNumber = playerDto.JerseyNumber,
                Position = playerDto.Position,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var validationResult = await _playerValidator.ValidateAsync(playerModel);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var result = await _playerRepository.AddPlayerAsync(playerModel);
            if (result)
                return Ok("Player added successfully.");
            else
                return StatusCode(500, "An error occurred while adding the player.");
        }

        // Get all players
        [HttpGet("players")]
        public async Task<IActionResult> GetAllPlayers()
        {
            var players = await _playerRepository.GetAllPlayersAsync();
            return Ok(players);
        }

        // Update a player
        [HttpPut("updateplayer/{playerId}")]
        public async Task<IActionResult> UpdatePlayer(int playerId, [FromForm] PlayerDto playerDto)
        {
            if (playerDto == null)
                return BadRequest("Invalid data.");

            // Check if the player exists
            var existingPlayer = await _playerRepository.GetPlayerByIdAsync(playerId);
            if (existingPlayer == null)
                return NotFound("Player not found.");

            // If a new image is provided, upload it to Cloudinary
            string imageUrl = existingPlayer.ImageUrl;
            if (playerDto.ImageFile != null)
            {
                imageUrl = await _cloudinaryService.UploadImageAsync(playerDto.ImageFile);
                if (string.IsNullOrEmpty(imageUrl))
                {
                    return StatusCode(500, "Image upload failed.");
                }
            }

            // Map DTO to PlayerModel
            var updatedPlayer = new PlayerModel
            {
                PlayerId = playerId,
                TeamId = playerDto.TeamId,
                PlayerName = playerDto.PlayerName,
                ImageUrl = imageUrl, // Set the new (or existing) image URL
                Age = playerDto.Age,
                JerseyNumber = playerDto.JerseyNumber,
                Position = playerDto.Position,
                UpdatedAt = DateTime.UtcNow
            };

            // Validate the updated PlayerModel
            var validationResult = await _playerValidator.ValidateAsync(updatedPlayer);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            // Save to the database
            await _playerRepository.UpdatePlayerAsync(updatedPlayer);

            return Ok("Player updated successfully.");
        }

        // Get player by ID
        [HttpGet("{playerId}")]
        public async Task<IActionResult> GetPlayerById(int playerId)
        {
            var player = await _playerRepository.GetPlayerByIdAsync(playerId);

            if (player == null)
                return NotFound("Player not found.");

            return Ok(player);
        }

        // Get players by team
        [HttpGet("team/{teamId}")]
        public async Task<IActionResult> GetPlayersByTeam(int teamId)
        {
            var players = await _playerRepository.GetPlayersByTeamAsync(teamId);

            if (!players.Any())
                return NotFound("No players found for this team.");

            return Ok(players);
        }

        // Search players by name or position
        [HttpGet("searchplayer")]
        public async Task<IActionResult> SearchPlayers([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return BadRequest("Search term cannot be empty.");

            var players = await _playerRepository.SearchPlayersAsync(searchTerm);

            if (!players.Any())
                return NotFound("No players found matching the search term.");

            return Ok(players);
        }
    }
}
