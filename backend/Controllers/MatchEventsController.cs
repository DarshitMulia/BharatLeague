using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchEventsController : ControllerBase
    {
        private readonly MatchEventsRepository _matchEventsRepository;

        public MatchEventsController(MatchEventsRepository matchEventsRepository)
        {
            _matchEventsRepository = matchEventsRepository;
        }

        [HttpPost("addevent")]
        public async Task<IActionResult> AddMatchEvent([FromBody] MatchEventsModel matchEvent)
        {
            await _matchEventsRepository.AddMatchEventAsync(matchEvent);
            return Ok("Match event added successfully.");
        }

        [HttpGet("{matchId}")]
        public async Task<IActionResult> GetMatchEventsByMatchId(int matchId)
        {
            var events = await _matchEventsRepository.GetMatchEventsByMatchIdAsync(matchId);
            return Ok(events);
        }

        [HttpDelete("deleteevent/{eventId}")]
        public async Task<IActionResult> DeleteMatchEvent(int eventId)
        {
            await _matchEventsRepository.DeleteMatchEventAsync(eventId);
            return Ok("Match event deleted successfully.");
        }
    }
}
