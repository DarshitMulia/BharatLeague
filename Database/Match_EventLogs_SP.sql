-- Adds a new event to the MatchEventLogs table.
ALTER PROCEDURE PR_AddMatchEvent
    @match_id INT,
    @team1_id INT,
    @team2_id INT,
    @player_id INT,
    @event_type NVARCHAR(50),
    @event_time INT,
	@team1_score INT,
	@team2_score INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO MatchEventLogs (match_id, team1_id, team2_id, player_id, event_type,event_time, team1_score, team2_score, created_at, updated_at)
    VALUES (@match_id, @team1_id, @team2_id, @player_id, @event_type, @event_time, @team1_score, @team2_score, GETDATE(), GETDATE());
END;


-- Fetches all events for a specific match.
ALTER PROCEDURE PR_GetMatchEventsByMatch
    @match_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM MatchEventLogs me
	INNER JOIN Match m ON me.match_id = m.match_id
    WHERE me.match_id = @match_id
    ORDER BY event_time ASC;
END;


-- Deletes an event from MatchEventLogs (optional, in case of corrections).
/* CREATE PROCEDURE SP_DeleteMatchEvent
    @event_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM MatchEventLogs
    WHERE event_id = @event_id;
END; */
