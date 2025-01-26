using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.Validator;
using FluentValidation;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeagueController : ControllerBase
    {
        private readonly LeagueRepository _leagueRepository;
        private readonly LeagueValidator _leagueValidator;
        private readonly CloudinaryService _cloudinaryService;

        public LeagueController(
            LeagueRepository leagueRepository,
            LeagueValidator leagueValidator,
            CloudinaryService cloudinaryService)
        {
            _leagueRepository = leagueRepository;
            _leagueValidator = leagueValidator;
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
        public async Task<IActionResult> AddLeague([FromForm] LeagueDto LeagueDto)
        {
            if (LeagueDto == null || LeagueDto.ImageFile == null)
                return BadRequest("Invalid data.");

            var imageUrl = await _cloudinaryService.UploadImageAsync(LeagueDto.ImageFile);
            if (string.IsNullOrEmpty(imageUrl))
            {
                return StatusCode(500, "Image upload failed.");
            }

            var leagueModel = new LeagueModel
            {
                UserId = LeagueDto.UserId,
                LeagueName = LeagueDto.LeagueName,
                Country = LeagueDto.Country,
                ImageUrl = imageUrl, 
                StartDate = (DateTime)LeagueDto.StartDate,
                EndDate = (DateTime)LeagueDto.EndDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var validationResult = await _leagueValidator.ValidateAsync(leagueModel);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var result = await _leagueRepository.AddLeagueAsync(leagueModel);
            if (result)
                return Ok("League added successfully.");

            return StatusCode(500, "An error occurred while adding the league.");
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

            if (league == null)
                return NotFound("League not found.");

            return Ok(league);
        }



        [HttpPut("UpdateLeague/{leagueid}")]
        public async Task<IActionResult> UpdateLeague(int leagueid, [FromForm] LeagueDto leagueDto)
        {
            try
            {
                var existingLeague = await _leagueRepository.GetLeagueByIdAsync(leagueid);
                if (existingLeague == null)
                {
                    return NotFound("League not found.");
                }

                if (leagueDto.ImageFile != null)
                {
                    string newImageUrl = await _cloudinaryService.UploadImageAsync(leagueDto.ImageFile);

                    existingLeague.ImageUrl = newImageUrl;
                }

                existingLeague.LeagueName = leagueDto.LeagueName ?? existingLeague.LeagueName;
                existingLeague.Country = leagueDto.Country ?? existingLeague.Country;
                existingLeague.StartDate = (DateTime)leagueDto.StartDate;
                existingLeague.EndDate = (DateTime)leagueDto.EndDate;
                //existingLeague.Status = leagueDto.Status ?? existingLeague.Status;
                existingLeague.UpdatedAt = DateTime.Now;

                // Save changes to the database
                await _leagueRepository.UpdateLeagueAsync(existingLeague);

                return Ok("League updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetLeaguesByUser(int userId)
        {
            var leagues = await _leagueRepository.GetLeaguesByUserAsync(userId);

            if (!leagues.Any())
                return NotFound("No leagues found for this user.");

            return Ok(leagues);
        }



        [HttpGet("ongoingleagues")]
        public async Task<IActionResult> GetOngoingLeagues()
        {
            var leagues = await _leagueRepository.GetOngoingLeaguesAsync();

            if (!leagues.Any())
                return NotFound("No ongoing leagues found.");

            return Ok(leagues);
        }
    }
}