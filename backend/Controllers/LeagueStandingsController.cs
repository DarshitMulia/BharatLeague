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
            var standings = await _leagueStandingsRepository.GetLeagueStandingsAsync(leagueId);
            return Ok(standings);
        }
    }
}
