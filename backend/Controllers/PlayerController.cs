using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlayerController : ControllerBase
    {
        private readonly PlayerRepository _playerRepository;
        private readonly CloudinaryService _cloudinaryService;

        public PlayerController(PlayerRepository playerRepository, CloudinaryService cloudinaryService)
        {
            _playerRepository = playerRepository;
            _cloudinaryService = cloudinaryService;
        }

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

        [HttpPost("addplayer")]
        public async Task<IActionResult> AddPlayer([FromForm] PlayerDto playerDto)
        {
            var imageUrl = await _cloudinaryService.UploadImageAsync(playerDto.ImageFile);
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

            await _playerRepository.AddPlayerAsync(playerModel);
            return Ok("Player added successfully.");
        }

        [HttpGet("players")]
        public async Task<IActionResult> GetAllPlayers()
        {
            var players = await _playerRepository.GetAllPlayersAsync();
            return Ok(players);
        }

        [HttpPut("updateplayer/{playerId}")]
        public async Task<IActionResult> UpdatePlayer(int playerId, [FromForm] PlayerDto playerDto)
        {
            var existingPlayer = await _playerRepository.GetPlayerByIdAsync(playerId);
            string imageUrl = existingPlayer.ImageUrl;
            if (playerDto.ImageFile != null)
                imageUrl = await _cloudinaryService.UploadImageAsync(playerDto.ImageFile);

            var updatedPlayer = new PlayerModel
            {
                PlayerId = playerId,
                TeamId = playerDto.TeamId,
                PlayerName = playerDto.PlayerName,
                ImageUrl = imageUrl,
                Age = playerDto.Age,
                JerseyNumber = playerDto.JerseyNumber,
                Position = playerDto.Position,
                UpdatedAt = DateTime.UtcNow
            };

            await _playerRepository.UpdatePlayerAsync(updatedPlayer);
            return Ok("Player updated successfully.");
        }

        [HttpGet("{playerId}")]
        public async Task<IActionResult> GetPlayerById(int playerId)
        {
            var player = await _playerRepository.GetPlayerByIdAsync(playerId);
            return Ok(player);
        }

        [HttpGet("team/{teamId}")]
        public async Task<IActionResult> GetPlayersByTeam(int teamId)
        {
            var players = await _playerRepository.GetPlayersByTeamAsync(teamId);
            return Ok(players);
        }

        [HttpGet("searchplayer")]
        public async Task<IActionResult> SearchPlayers([FromQuery] string searchTerm)
        {
            var players = await _playerRepository.SearchPlayersAsync(searchTerm);
            return Ok(players);
        }
    }
}
