using FluentValidation;
using backend.Models;
using backend.Validator;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LeagueController : ControllerBase
    {
        private readonly LeagueRepository _leagueRepository;
        private readonly CloudinaryService _cloudinaryService;

        public LeagueController(LeagueRepository leagueRepository, CloudinaryService cloudinaryService)
        {
            _leagueRepository = leagueRepository;
            _cloudinaryService = cloudinaryService;
        }

        public class LeagueDto
        {
            public int LeagueId { get; set; }
            public int UserId { get; set; }
            public string LeagueName { get; set; }
            public string Country { get; set; }
            public IFormFile ImageFile { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
        }

        [HttpPost("addleague")]
        public async Task<IActionResult> AddLeague([FromForm] LeagueDto leagueDto)
        {
            var imageUrl = await _cloudinaryService.UploadImageAsync(leagueDto.ImageFile);
            var leagueModel = new LeagueModel
            {
                UserId = leagueDto.UserId,
                LeagueName = leagueDto.LeagueName,
                Country = leagueDto.Country,
                ImageUrl = imageUrl,
                StartDate = (DateTime)leagueDto.StartDate,
                EndDate = (DateTime)leagueDto.EndDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Status = "Scheduled" 
            };

            var validator = new LeagueValidator();
            var validationResult = validator.Validate(leagueModel);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            await _leagueRepository.AddLeagueAsync(leagueModel);
            return Ok("League added successfully.");
        }

        [HttpGet("leagues")]
        public async Task<IActionResult> GetAllLeagues()
        {
            var leagues = await _leagueRepository.GetAllLeaguesAsync();
            return Ok(leagues);
        }

        [HttpGet("{leagueid}")]
        public async Task<IActionResult> GetLeagueById(int leagueid)
        {
            var league = await _leagueRepository.GetLeagueByIdAsync(leagueid);
            return Ok(league);
        }

        [HttpPut("UpdateLeague/{leagueid}")]
        public async Task<IActionResult> UpdateLeague(int leagueid, [FromForm] LeagueDto leagueDto)
        {
            var existingLeague = await _leagueRepository.GetLeagueByIdAsync(leagueid);
            if (leagueDto.ImageFile != null)
            {
                existingLeague.ImageUrl = await _cloudinaryService.UploadImageAsync(leagueDto.ImageFile);
            }
            existingLeague.LeagueName = leagueDto.LeagueName;
            existingLeague.Country = leagueDto.Country;
            existingLeague.StartDate = (DateTime)leagueDto.StartDate;
            existingLeague.EndDate = (DateTime)leagueDto.EndDate;
            existingLeague.UpdatedAt = DateTime.Now;

            await _leagueRepository.UpdateLeagueAsync(existingLeague);
            return Ok("League updated successfully.");
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetLeaguesByUser(int userId)
        {
            var leagues = await _leagueRepository.GetLeaguesByUserAsync(userId);
            return Ok(leagues);
        }

        [HttpGet("ongoingleagues")]
        public async Task<IActionResult> GetOngoingLeagues()
        {
            var leagues = await _leagueRepository.GetOngoingLeaguesAsync();
            return Ok(leagues);
        }

        [HttpGet("searchleague")]
        public async Task<IActionResult> SearchLeagues([FromQuery] string searchTerm)
        {
            var leagues = await _leagueRepository.SearchLeaguesAsync(searchTerm);
            return Ok(leagues);
        }
    }
}
