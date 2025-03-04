using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MatchController : ControllerBase
    {
        private readonly MatchRepository _matchRepository;

        public MatchController(MatchRepository matchRepository)
        {
            _matchRepository = matchRepository;
        }

        [HttpPost("addmatch")]
        public async Task<IActionResult> AddMatch([FromBody] MatchModel matchModel)
        {
            await _matchRepository.AddMatchAsync(matchModel);
            return Ok("Match added successfully.");
        }

        [HttpPut("updatematch/{matchId}")]
        public async Task<IActionResult> UpdateMatch(int matchId, [FromBody] MatchModel matchModel)
        {
            var updatedMatch = await _matchRepository.UpdateMatchAsync(matchModel);
            return Ok(new { message = "Match updated successfully.", data = updatedMatch });
        }

        [HttpGet("matches")]
        public async Task<IActionResult> GetAllMatches()
        {
            var matches = await _matchRepository.GetAllMatchesAsync();
            return Ok(matches);
        }

        [HttpGet("league/{leagueId}")]
        public async Task<IActionResult> GetMatchesByLeagueId(int leagueId)
        {
            var matches = await _matchRepository.GetMatchesByLeagueIdAsync(leagueId);
            return Ok(matches);
        }

        [HttpPut("markongoing/{matchId}")]
        public async Task<IActionResult> MarkMatchOngoing(int matchId)
        {
            await _matchRepository.MarkMatchOngoingAsync(matchId);
            return Ok("Match marked as ongoing successfully.");
        }

        [HttpGet("ongoingmatches")]
        public async Task<IActionResult> GetOngoingMatches()
        {
            var matches = await _matchRepository.GetOngoingMatchesAsync();
            return Ok(matches);
        }

        [HttpGet("scheduledmatches/{leagueId}")]
        public async Task<IActionResult> GetScheduledMatchesByLeague(int leagueId)
        {
            var matches = await _matchRepository.GetScheduledMatchesByLeagueAsync(leagueId);
            return Ok(matches);
        }

        [HttpGet("ongoingmatches/{leagueId}")]
        public async Task<IActionResult> GetOngoingMatchesByLeague(int leagueId)
        {
            var matches = await _matchRepository.GetOngoingMatchesByLeagueAsync(leagueId);
            return Ok(matches);
        }

        [HttpGet("completedmatches/{leagueId}")]
        public async Task<IActionResult> GetCompletedMatchesByLeague(int leagueId)
        {
            var matches = await _matchRepository.GetCompletedMatchesByLeagueAsync(leagueId);
            return Ok(matches);
        }

        [HttpGet("{matchId}")]
        public async Task<IActionResult> GetMatchById(int matchId)
        {
            var match = await _matchRepository.GetMatchByIdAsync(matchId);
            return Ok(match);
        }

        [HttpGet("searchmatches")]
        public async Task<IActionResult> SearchMatches([FromQuery] string? teamName, [FromQuery] string? venue)
        {
            var matches = await _matchRepository.SearchMatchesAsync(teamName, venue);
            return Ok(matches);
        }
    }
}
