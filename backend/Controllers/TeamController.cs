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
    public class TeamController : ControllerBase
    {
        private readonly TeamRepository _teamRepository;
        private readonly CloudinaryService _cloudinaryService;

        public TeamController(TeamRepository teamRepository, CloudinaryService cloudinaryService)
        {
            _teamRepository = teamRepository;
            _cloudinaryService = cloudinaryService;
        }

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
            var imageUrl = await _cloudinaryService.UploadImageAsync(teamDto.ImageFile);
            var teamModel = new TeamModel
            {
                LeagueId = teamDto.LeagueId,
                TeamName = teamDto.TeamName,
                ImageUrl = imageUrl,
                City = teamDto.City,
                CoachName = teamDto.CoachName,
                FoundedYear = teamDto.FoundedYear,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _teamRepository.AddTeamAsync(teamModel);
            return Ok("Team added successfully.");
        }

        [HttpPut("updateteam/{teamId}")]
        public async Task<IActionResult> UpdateTeam(int teamId, [FromForm] TeamDto teamDto)
        {
            var existingTeam = await _teamRepository.GetTeamByIdAsync(teamId);
            existingTeam.ImageUrl = await _cloudinaryService.UploadImageAsync(teamDto.ImageFile);
            existingTeam.TeamName = teamDto.TeamName;
            existingTeam.City = teamDto.City;
            existingTeam.CoachName = teamDto.CoachName;
            existingTeam.FoundedYear = teamDto.FoundedYear;
            existingTeam.UpdatedAt = DateTime.Now;
            await _teamRepository.UpdateTeamAsync(existingTeam);
            return Ok("Team updated successfully.");
        }

        [HttpGet("teams")]
        public async Task<IActionResult> GetAllTeams()
        {
            var teams = await _teamRepository.GetAllTeamsAsync();
            return Ok(teams);
        }

        [HttpGet("league/{leagueId}")]
        public async Task<IActionResult> GetTeamsByLeagueId(int leagueId)
        {
            var teams = await _teamRepository.GetTeamsByLeagueIdAsync(leagueId);
            return Ok(teams);
        }

        [HttpGet("{teamId}")]
        public async Task<IActionResult> GetTeamById(int teamId)
        {
            var team = await _teamRepository.GetTeamByIdAsync(teamId);
            return Ok(team);
        }

        [HttpGet("match/{matchId}")]
        public async Task<IActionResult> GetTeamsByMatchId(int matchId)
        {
            var teams = await _teamRepository.GetTeamsByMatchIdAsync(matchId);
            return Ok(teams);
        }

        [HttpGet("searchteam")]
        public async Task<IActionResult> SearchTeams([FromQuery] string searchTerm)
        {
            var teams = await _teamRepository.SearchTeamsAsync(searchTerm);
            return Ok(teams);
        }
    }
}
