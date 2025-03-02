-- Procedure to Add a new event to the MatchEventLogs table.
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


-- Procedure to Fetch all events for a specific match.
CREATE PROCEDURE PR_GetMatchEventsByMatchId
    @match_id INT
AS
BEGIN
    SELECT * FROM MatchEvents 
	WHERE match_id = @match_id 
	ORDER BY event_time;
END;


-- Procedure to Delete an event from MatchEventLogs
ALTER PROCEDURE PR_DeleteMatchEvent
    @event_id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @player_id INT,
                @event_type NVARCHAR(50);
        
        SELECT 
            @player_id = player_id,
            @event_type = event_type
        FROM MatchEvents
        WHERE event_id = @event_id;
        
        IF (@player_id IS NOT NULL)
        BEGIN
            UPDATE PlayerStatistics
            SET 
                goals = goals - CASE WHEN @event_type = 'Goal' THEN 1 ELSE 0 END,
                assists = assists - CASE WHEN @event_type = 'Assist' THEN 1 ELSE 0 END,
                yellow_cards = yellow_cards - CASE WHEN @event_type = 'Yellow Card' THEN 1 ELSE 0 END,
                red_cards = red_cards - CASE WHEN @event_type = 'Red Card' THEN 1 ELSE 0 END,
                fouls = fouls - CASE WHEN @event_type = 'Foul' THEN 1 ELSE 0 END,
                updated_at = GETDATE()
            WHERE player_id = @player_id;
        END
        
        DELETE FROM MatchEvents WHERE event_id = @event_id;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

