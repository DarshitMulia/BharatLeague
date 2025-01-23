-- Adds a new event to the MatchEventLogs table.
CREATE PROCEDURE PR_AddMatchEvent
    @match_id INT,
    @team_id INT,
    @player_id INT,
    @event_type NVARCHAR(50),
    @event_time INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Assuming that @minute is the minute of the match (e.g., 56 for 56th minute).
    INSERT INTO MatchEventLogs (match_id, team_id, player_id, event_type, event_time, created_at, updated_at)
    VALUES (@match_id, @team_id, @player_id, @event_type, @event_time, GETDATE(), GETDATE());
END;


-- Fetches all events for a specific match.
CREATE PROCEDURE PR_GetMatchEventsByMatch
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
