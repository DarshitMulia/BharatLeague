-- This procedure inserts and updates the statistics for a player (e.g., goals, assists, yellow cards, etc.) based on actions taken in a match.
CREATE PROCEDURE PR_UpdatePlayerStatistics
    @player_id INT,
    @event_type NVARCHAR(50),
    @increment_match BIT = 0  
AS
BEGIN
    IF EXISTS (SELECT 1 FROM PlayerStatistics WHERE player_id = @player_id)
    BEGIN
        UPDATE PlayerStatistics
        SET 
            matches_played = matches_played + CASE WHEN @increment_match = 1 THEN 1 ELSE 0 END,
            goals = goals + CASE WHEN @event_type = 'Goal' THEN 1 ELSE 0 END,
            assists = assists + CASE WHEN @event_type = 'Assist' THEN 1 ELSE 0 END,
            yellow_cards = yellow_cards + CASE WHEN @event_type = 'Yellow Card' THEN 1 ELSE 0 END,
            red_cards = red_cards + CASE WHEN @event_type = 'Red Card' THEN 1 ELSE 0 END,
            fouls = fouls + CASE WHEN @event_type = 'Foul' THEN 1 ELSE 0 END,
            updated_at = GETDATE()
        WHERE player_id = @player_id;
    END
    ELSE
    BEGIN
        INSERT INTO PlayerStatistics 
        (
            player_id, 
            matches_played, 
            goals, 
            assists, 
            yellow_cards, 
            red_cards, 
            fouls, 
            created_at, 
            updated_at
        )
        VALUES 
        (
            @player_id,
            CASE WHEN @increment_match = 1 THEN 1 ELSE 0 END,
            CASE WHEN @event_type = 'Goal' THEN 1 ELSE 0 END,
            CASE WHEN @event_type = 'Assist' THEN 1 ELSE 0 END,
            CASE WHEN @event_type = 'Yellow Card' THEN 1 ELSE 0 END,
            CASE WHEN @event_type = 'Red Card' THEN 1 ELSE 0 END,
            CASE WHEN @event_type = 'Foul' THEN 1 ELSE 0 END,
            GETDATE(),
            GETDATE()
        );
    END
END;


-- To update the match participation for all players in match
CREATE PROCEDURE PR_IncrementMatchesPlayedAndMarkTheMatchStatusAsCompletedAsWellAsUpdateLeagueStandings
    @match_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        UPDATE ps
        SET 
            ps.matches_played = ps.matches_played + 1,
            ps.updated_at = GETDATE()
        FROM PlayerStatistics ps
        INNER JOIN Player p ON ps.player_id = p.player_id
        WHERE p.team_id IN (
            SELECT team1_id FROM Match WHERE match_id = @match_id
            UNION
            SELECT team2_id FROM Match WHERE match_id = @match_id
        );
        INSERT INTO PlayerStatistics 
        (
            player_id, 
            matches_played, 
            goals, 
            assists, 
            yellow_cards, 
            red_cards, 
            fouls, 
            created_at, 
            updated_at
        )
        SELECT 
            p.player_id, 
            1,          
            0,          
            0,          
            0,          
            0,          
            0,          
            GETDATE(),
            GETDATE()
        FROM Player p
        WHERE p.team_id IN (
            SELECT team1_id FROM Match WHERE match_id = @match_id
            UNION
            SELECT team2_id FROM Match WHERE match_id = @match_id
        )
        AND NOT EXISTS (
            SELECT 1 
            FROM PlayerStatistics ps 
            WHERE ps.player_id = p.player_id
        );
        UPDATE Match
        SET status = 'Completed',
            updated_at = GETDATE()
        WHERE match_id = @match_id;

        EXEC PR_UpdateLeagueStandingsFromMatch @match_id = @match_id;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;


-- Retrieves a player's statistics specifically for a given match
CREATE PROCEDURE PR_GetPlayerStatisticsByMatchId
    @match_id INT,
    @player_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        @player_id AS player_id,
        @match_id AS match_id,
        SUM(CASE WHEN event_type = 'Goal' THEN 1 ELSE 0 END) AS Goals,
        SUM(CASE WHEN event_type = 'Assist' THEN 1 ELSE 0 END) AS Assists,
        SUM(CASE WHEN event_type = 'Yellow Card' THEN 1 ELSE 0 END) AS YellowCards,
        SUM(CASE WHEN event_type = 'Red Card' THEN 1 ELSE 0 END) AS RedCards,
        SUM(CASE WHEN event_type = 'Foul' THEN 1 ELSE 0 END) AS Fouls
    FROM MatchEvents
    WHERE match_id = @match_id
      AND player_id = @player_id
    GROUP BY player_id, match_id;
END;


-- Retrieves overall statistics for a specific player.
CREATE PROCEDURE PR_GetPlayerStatisticsByPlayerId
    @player_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM PlayerStatistics WHERE player_id = @player_id;
END;
