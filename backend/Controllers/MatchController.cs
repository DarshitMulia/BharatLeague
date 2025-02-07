using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.Validator;
using FluentValidation;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MatchController : ControllerBase
    {
        private readonly MatchRepository _matchRepository;
        private readonly MatchValidator _matchValidator;

        public MatchController(MatchRepository matchRepository, MatchValidator matchValidator)
        {
            _matchRepository = matchRepository;
            _matchValidator = matchValidator;
        }

        // Add a new match
        [HttpPost("addmatch")]
        public async Task<IActionResult> AddMatch([FromBody] MatchModel matchModel)
        {
            if (matchModel == null)
                return BadRequest("Invalid data.");

            var validationResult = await _matchValidator.ValidateAsync(matchModel);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var result = await _matchRepository.AddMatchAsync(matchModel);

            if (result)
                return Ok("Match added successfully.");
            else
                return StatusCode(500, "An error occurred while adding the match.");
        }

        // Update a match
        [HttpPut("updatematch/{matchId}")]
        public async Task<IActionResult> UpdateMatch(int matchId, [FromBody] MatchModel matchModel)
        {
            if (matchModel == null)
                return BadRequest("Invalid data.");

            // Validate the MatchModel
            var validationResult = await _matchValidator.ValidateAsync(matchModel);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            // Ensure the MatchId matches
            if (matchId != matchModel.MatchId)
            {
                return BadRequest("Match ID mismatch.");
            }

            try
            {
                var updatedMatch = await _matchRepository.UpdateMatchAsync(matchModel);

                if (updatedMatch != null)
                {
                    return Ok(new { message = "Match updated successfully.", data = updatedMatch });
                }
                else
                {
                    return NotFound("Match not found.");
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"An error occurred while updating the match: {ex.Message}");
            }
        }

        // Get all matches by league ID
        [HttpGet("league/{leagueId}")]
        public async Task<IActionResult> GetMatchesByLeagueId(int leagueId)
        {
            var matches = await _matchRepository.GetMatchesByLeagueIdAsync(leagueId);

            if (!matches.Any())
                return Ok(new List<MatchModel>());

            return Ok(matches);
        }

        [HttpPut("markongoing/{matchId}")]
        public async Task<IActionResult> MarkMatchOngoing(int matchId)
        {
            var result = await _matchRepository.MarkMatchOngoingAsync(matchId);

            if (result)
                return Ok("Match marked as ongoing successfully.");
            else
                return StatusCode(500, "An error occurred while marking the match as ongoing.");
        }

        [HttpGet("ongoingmatches")]
        public async Task<IActionResult> GetOngoingMatches()
        {
            var matches = await _matchRepository.GetOngoingMatchesAsync();

            if (!matches.Any())
                return NotFound("No ongoing matches found.");

            return Ok(matches);
        }

        // Get scheduled matches by league ID
        [HttpGet("scheduledmatches/{leagueId}")]
        public async Task<IActionResult> GetScheduledMatchesByLeague(int leagueId)
        {
            var matches = await _matchRepository.GetScheduledMatchesByLeagueAsync(leagueId);

            if (!matches.Any())
                return Ok(new List<MatchModel>());

            return Ok(matches);
        }

        // Get ongoing matches by league ID
        [HttpGet("ongoingmatches/{leagueId}")]
        public async Task<IActionResult> GetOngoingMatchesByLeague(int leagueId)
        {
            var matches = await _matchRepository.GetOngoingMatchesByLeagueAsync(leagueId);

            if (!matches.Any())
                return Ok(new List<MatchModel>());

            return Ok(matches);
        }

        // Get completed matches by league ID
        [HttpGet("completedmatches/{leagueId}")]
        public async Task<IActionResult> GetCompletedMatchesByLeague(int leagueId)
        {
            var matches = await _matchRepository.GetCompletedMatchesByLeagueAsync(leagueId);

            if (!matches.Any())
                return Ok(new List<MatchModel>());

            return Ok(matches);
        }

        // Get match by ID
        [HttpGet("{matchId}")]
        public async Task<IActionResult> GetMatchById(int matchId)
        {
            var match = await _matchRepository.GetMatchByIdAsync(matchId);

            if (match == null)
                return NotFound("Match not found.");

            return Ok(match);
        }

        // Search matches by venue or team names
        [HttpGet("searchmatch")]
        public async Task<IActionResult> SearchMatches([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return BadRequest("Search term cannot be empty.");

            var matches = await _matchRepository.SearchMatchesAsync(searchTerm);

            if (!matches.Any())
                return NotFound("No matches matched the search criteria.");

            return Ok(matches);
        }
    }
}
