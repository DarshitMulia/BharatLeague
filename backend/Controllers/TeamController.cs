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
    public class TeamController : ControllerBase
    {
        private readonly TeamRepository _teamRepository;
        private readonly TeamValidator _teamValidator;
        private readonly CloudinaryService _cloudinaryService;

        public TeamController(TeamRepository teamRepository, TeamValidator teamValidator, CloudinaryService cloudinaryService)
        {
            _teamRepository = teamRepository;
            _teamValidator = teamValidator;
            _cloudinaryService = cloudinaryService;
        }

        // DTO for handling image upload
        public class TeamDto
        {
            public int TeamId { get; set; }
            public int LeagueId { get; set; }
            public string TeamName { get; set; }
            public IFormFile ImageFile { get; set; }
            public string City { get; set; }
            public string CoachName { get; set; }
            public int FoundedYear { get; set; }
        }

        [HttpPost("addteam")]
        public async Task<IActionResult> AddTeam([FromForm] TeamDto teamDto)
        {
            if (teamDto == null || teamDto.ImageFile == null)
                return BadRequest("Invalid data.");

            // Upload the image to Cloudinary
            var imageUrl = await _cloudinaryService.UploadImageAsync(teamDto.ImageFile);
            if (string.IsNullOrEmpty(imageUrl))
            {
                return StatusCode(500, "Image upload failed.");
            }

            // Map DTO to TeamModel
            var teamModel = new TeamModel
            {
                LeagueId = teamDto.LeagueId,
                TeamName = teamDto.TeamName,
                ImageUrl = imageUrl, // Set the uploaded image URL
                City = teamDto.City,
                CoachName = teamDto.CoachName,
                FoundedYear = teamDto.FoundedYear,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Save to the database
            var result = await _teamRepository.AddTeamAsync(teamModel);
            if (result)
                return Ok("Team added successfully.");

            return StatusCode(500, "An error occurred while adding the team.");
        }

        [HttpPut("updateteam/{teamId}")]
        public async Task<IActionResult> UpdateTeam(int teamId, [FromForm] TeamDto teamDto)
        {
            if (teamDto == null)
                return BadRequest("Invalid data.");

            // Ensure the TeamId matches
            if (teamId != teamDto.TeamId)
            {
                return BadRequest("Team ID mismatch.");
            }

            try
            {
                var existingTeam = await _teamRepository.GetTeamByIdAsync(teamId);

                if (existingTeam == null)
                {
                    return NotFound("Team not found.");
                }

                // Upload new image if provided
                if (teamDto.ImageFile != null)
                {
                    string newImageUrl = await _cloudinaryService.UploadImageAsync(teamDto.ImageFile);
                    existingTeam.ImageUrl = newImageUrl; // Update ImageUrl field
                }

                // Update other properties
                existingTeam.TeamName = teamDto.TeamName ?? existingTeam.TeamName;
                existingTeam.City = teamDto.City ?? existingTeam.City;
                existingTeam.CoachName = teamDto.CoachName ?? existingTeam.CoachName;
                existingTeam.FoundedYear = teamDto.FoundedYear != 0 ? teamDto.FoundedYear : existingTeam.FoundedYear;
                existingTeam.UpdatedAt = DateTime.Now;

                // Save changes to the database
                await _teamRepository.UpdateTeamAsync(existingTeam);

                return Ok("Team updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the team: {ex.Message}");
            }
        }

        // Get all teams by league ID
        [HttpGet("league/{leagueId}")]
        public async Task<IActionResult> GetTeamsByLeagueId(int leagueId)
        {
            var teams = await _teamRepository.GetTeamsByLeagueIdAsync(leagueId);

            if (!teams.Any())
                return NotFound("No teams found for this league.");

            return Ok(teams);
        }
        // Get team by ID
        [HttpGet("{teamId}")]
        public async Task<IActionResult> GetTeamById(int teamId)
        {
            var team = await _teamRepository.GetTeamByIdAsync(teamId);

            if (team == null)
                return NotFound("Team not found.");

            return Ok(team);
        }

        // Search teams by name or city
        [HttpGet("searchteam")]
        public async Task<IActionResult> SearchTeams([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return BadRequest("Search term cannot be empty.");

            var teams = await _teamRepository.SearchTeamsAsync(searchTerm);

            if (!teams.Any())
                return NotFound("No teams matched the search criteria.");

            return Ok(teams);
        }
    }
}
