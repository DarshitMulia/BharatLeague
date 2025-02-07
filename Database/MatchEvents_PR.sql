-- Adds a new event to the MatchEventLogs table.
CREATE PROCEDURE PR_AddMatchEvent
    @match_id INT,
    @team_id INT,
    @player_id INT = NULL,  
    @event_type NVARCHAR(50),
    @event_time INT,
    @additional_info NVARCHAR(500) = NULL
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        INSERT INTO MatchEvents 
            (match_id, team_id, player_id, event_type, event_time, additional_info, created_at, updated_at)
        VALUES 
            (@match_id, @team_id, @player_id, @event_type, @event_time, @additional_info, GETDATE(), GETDATE());
        IF (@player_id IS NOT NULL)
        BEGIN
            EXEC PR_UpdatePlayerStatistics 
                @player_id = @player_id, 
                @event_type = @event_type,
                @increment_match = 0;
        END
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;


-- Fetches all events for a specific match.
CREATE PROCEDURE PR_GetMatchEventsByMatchId
    @match_id INT
AS
BEGIN
    SELECT * FROM MatchEvents 
	WHERE match_id = @match_id 
	ORDER BY event_time;
END;


-- Deletes an event from MatchEventLogs (optional, in case of corrections).
CREATE PROCEDURE PR_DeleteMatchEvent
    @event_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM MatchEvents WHERE event_id = @event_id;
END;

