using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeagueStandingsController : ControllerBase
    {
        private readonly LeagueStandingsRepository _leagueStandingsRepository;

        public LeagueStandingsController(LeagueStandingsRepository leagueStandingsRepository)
        {
            _leagueStandingsRepository = leagueStandingsRepository;
        }

        [HttpGet("{leagueId}")]
        public async Task<IActionResult> GetLeagueStandings(int leagueId)
        {
            List<LeagueStandingsModel> standings = await _leagueStandingsRepository.GetLeagueStandingsAsync(leagueId);

            if (standings == null || standings.Count == 0)
                return NotFound("No league standings found for this league.");

            return Ok(standings);
        }
    }
}
