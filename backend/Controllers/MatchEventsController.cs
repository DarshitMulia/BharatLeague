using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;

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
            if (matchEvent == null)
                return BadRequest("Invalid match event data.");

            var result = await _matchEventsRepository.AddMatchEventAsync(matchEvent);
            if (result)
                return Ok("Match event added successfully.");
            else
                return StatusCode(500, "An error occurred while adding the match event.");
        }

        [HttpGet("{matchId}")]
        public async Task<IActionResult> GetMatchEventsByMatchId(int matchId)
        {
            var events = await _matchEventsRepository.GetMatchEventsByMatchIdAsync(matchId);
            if (events == null || events.Count == 0)
                return Ok(new List<MatchEventsModel>());
            return Ok(events);
        }

        [HttpDelete("deleteevent/{eventId}")]
        public async Task<IActionResult> DeleteMatchEvent(int eventId)
        {
            var result = await _matchEventsRepository.DeleteMatchEventAsync(eventId);
            if (result)
                return Ok("Match event deleted successfully.");
            else
                return StatusCode(500, "An error occurred while deleting the match event.");
        }
    }
}
