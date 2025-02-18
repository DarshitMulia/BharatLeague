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
            await _playerStatisticsRepository.UpdatePlayerStatisticsAsync(request.PlayerId, request.EventType, request.IncrementMatch);
            return Ok("Player statistics updated successfully.");
        }

        [HttpPut("matchcomplete/{matchId}")]
        public async Task<IActionResult> CompleteMatch(int matchId)
        {
            await _playerStatisticsRepository.IncrementMatchesPlayedAndMarkMatchCompletedAsync(matchId);
            return Ok("Match completed and player statistics updated.");
        }

        [HttpGet("match/{matchId}/player/{playerId}")]
        public async Task<IActionResult> GetPlayerStatisticsByMatchId(int matchId, int playerId)
        {
            var stats = await _playerStatisticsRepository.GetPlayerStatisticsByMatchIdAsync(matchId, playerId);
            return Ok(stats);
        }

        [HttpGet("{playerId}")]
        public async Task<IActionResult> GetPlayerStatisticsByPlayerId(int playerId)
        {
            var stats = await _playerStatisticsRepository.GetPlayerStatisticsByPlayerIdAsync(playerId);
            if (stats == null)
            {
                return Ok(new List<PlayerStatisticsModel>());
            }
            return Ok(stats);
        }
    }
}
