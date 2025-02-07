using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerStatisticsController : ControllerBase
    {
        private readonly PlayerStatisticsRepository _playerStatisticsRepository;

        public PlayerStatisticsController(PlayerStatisticsRepository playerStatisticsRepository)
        {
            _playerStatisticsRepository = playerStatisticsRepository;
        }

        public class UpdatePlayerStatisticsRequest
        {
            public int PlayerId { get; set; }
            public string EventType { get; set; }
            public bool IncrementMatch { get; set; }
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdatePlayerStatistics([FromBody] UpdatePlayerStatisticsRequest request)
        {
            if (request == null)
                return BadRequest("Invalid data.");

            var result = await _playerStatisticsRepository.UpdatePlayerStatisticsAsync(request.PlayerId, request.EventType, request.IncrementMatch);
            if (result)
                return Ok("Player statistics updated successfully.");
            else
                return StatusCode(500, "An error occurred while updating player statistics.");
        }

        [HttpPut("matchcomplete/{matchId}")]
        public async Task<IActionResult> CompleteMatch(int matchId)
        {
            var result = await _playerStatisticsRepository.IncrementMatchesPlayedAndMarkMatchCompletedAsync(matchId);
            if (result)
                return Ok("Match completed and player statistics updated.");
            else
                return StatusCode(500, "An error occurred while completing the match and updating statistics.");
        }

        [HttpGet("match/{matchId}/player/{playerId}")]
        public async Task<IActionResult> GetPlayerStatisticsByMatchId(int matchId, int playerId)
        {
            var stats = await _playerStatisticsRepository.GetPlayerStatisticsByMatchIdAsync(matchId, playerId);
            if (stats == null)
                return NotFound("No statistics found for the specified player and match.");
            return Ok(stats);
        }

        [HttpGet("{playerId}")]
        public async Task<IActionResult> GetPlayerStatisticsByPlayerId(int playerId)
        {
            var stats = await _playerStatisticsRepository.GetPlayerStatisticsByPlayerIdAsync(playerId);
            if (stats == null)
                return NotFound("No statistics found for the specified player.");
            return Ok(stats);
        }
    }
}
