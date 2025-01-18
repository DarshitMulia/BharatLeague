-- Stored Procedures for Game_Statistics Table

-- Stored Procedure to Auto-Populate or Update Game_Statistics
ALTER PROCEDURE PR_UpdateGameStatistics
AS
BEGIN
    BEGIN TRY
        DECLARE @MatchID INT;
        DECLARE @PlayerID INT;
        DECLARE @Goal INT;
        DECLARE @Assist INT;
        DECLARE @Foul INT;
        DECLARE @YellowCard INT;
        DECLARE @RedCard INT;

        DECLARE action_cursor CURSOR FOR
        SELECT match_id, player_id, goals, assists, fouls, yellow_cards, red_cards
        FROM PlayerActions;

        OPEN action_cursor;
        FETCH NEXT FROM action_cursor INTO @MatchID, @PlayerID, @Goal, @Assist, @Foul, @YellowCard, @RedCard;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            IF EXISTS (SELECT 1 FROM Game_Statistics WHERE match_id = @MatchID AND player_id = @PlayerID)
            BEGIN
                UPDATE Game_Statistics
                SET goals = goals + @Goal,
                    assists = assists + @Assist,
                    fouls = fouls + @Foul,
                    yellow_cards = yellow_cards + @YellowCard,
                    red_cards = red_cards + @RedCard,
                    updated_at = GETDATE()
                WHERE match_id = @MatchID AND player_id = @PlayerID;
            END
            ELSE
            BEGIN
                INSERT INTO Game_Statistics (match_id, player_id, goals, assists, fouls, yellow_cards, red_cards, created_at, updated_at)
                VALUES (@MatchID, @PlayerID, @Goal, @Assist, @Foul, @YellowCard, @RedCard, GETDATE(), GETDATE());
            END

            FETCH NEXT FROM action_cursor INTO @MatchID, @PlayerID, @Goal, @Assist, @Foul, @YellowCard, @RedCard;
        END;

        CLOSE action_cursor;
        DEALLOCATE action_cursor;

    END TRY
    BEGIN CATCH
        PRINT 'Error occurred: ' + ERROR_MESSAGE();
    END CATCH
END;


-- Procedure to Fetch Statistics for a Specific Player Across All Matches
CREATE PROCEDURE PR_GetPlayerStatistics
    @PlayerID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        player_id,
        SUM(goals) AS TotalGoals,
        SUM(assists) AS TotalAssists,
        SUM(fouls) AS TotalFouls,
        SUM(yellow_cards) AS TotalYellowCards,
        SUM(red_cards) AS TotalRedCards
    FROM Game_Statistics
    WHERE player_id = @PlayerID
    GROUP BY player_id;
END;


-- Procedure to Fetch Match-Wise Player Statistics
CREATE PROCEDURE PR_GetPlayerStatisticsByMatch
    @MatchID INT,
    @PlayerID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        goals,
        assists,
        fouls,
        yellow_cards,
        red_cards
    FROM Game_Statistics
    WHERE match_id = @MatchID AND player_id = @PlayerID;
END;

-- Procedure to Fetch All Statistics for a Specific Match
CREATE PROCEDURE PR_GetMatchStatistics
    @MatchID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        gs.player_id,
        p.name AS PlayerName,
        gs.goals,
        gs.assists,
        gs.fouls,
        gs.yellow_cards,
        gs.red_cards
    FROM Game_Statistics gs
    INNER JOIN Player p ON gs.player_id = p.player_id
    WHERE gs.match_id = @MatchID;
END;


-- Procedure to Fetch Top Players Based on Goals, Assists, or Other Metrics
ALTER PROCEDURE PR_GetTopPlayers
    @Metric NVARCHAR(50),
    @TopN INT
AS
BEGIN
    SET NOCOUNT ON;
    IF @Metric NOT IN ('goals', 'assists', 'fouls', 'yellow_cards', 'red_cards')
    BEGIN
        PRINT 'Invalid Metric';
        RETURN;
    END

    DECLARE @Query NVARCHAR(MAX);

    SET @Query = 'SELECT TOP (' + CAST(@TopN AS NVARCHAR) + ') 
                      gs.player_id, 
                      p.name AS PlayerName, 
                      SUM(gs.' + @Metric + ') AS TotalMetric
                   FROM Game_Statistics gs
                   INNER JOIN Player p ON gs.player_id = p.player_id
                   GROUP BY gs.player_id, p.name
                   ORDER BY TotalMetric DESC';

    EXEC sp_executesql @Query;
END;


-- Procedure to Delete Statistics for a Specific Player in a Match
-- CREATE PROCEDURE PR_DeletePlayerStatistics
--    @MatchID INT,
--    @PlayerID INT
-- AS
-- BEGIN
--    SET NOCOUNT ON;

--    DELETE FROM Game_Statistics
--    WHERE match_id = @MatchID AND player_id = @PlayerID;

--    PRINT 'Player statistics deleted successfully.';
-- END;


-- Procedure to Reset Statistics for a Match
-- CREATE PROCEDURE PR_ResetMatchStatistics
--    @MatchID INT
-- AS
-- BEGIN
--    SET NOCOUNT ON;

--    DELETE FROM Game_Statistics
--    WHERE match_id = @MatchID;

--    PRINT 'Match statistics reset successfully.';
-- END;


-- Procedure to Fetch Aggregate League-Wise Player Statistics
CREATE PROCEDURE PR_GetLeaguePlayerStatistics
    @LeagueID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        gs.player_id,
        p.name AS PlayerName,
        SUM(gs.goals) AS TotalGoals,
        SUM(gs.assists) AS TotalAssists,
        SUM(gs.fouls) AS TotalFouls,
        SUM(gs.yellow_cards) AS TotalYellowCards,
        SUM(gs.red_cards) AS TotalRedCards
    FROM Game_Statistics gs
    INNER JOIN Match m ON gs.match_id = m.match_id
    INNER JOIN Player p ON gs.player_id = p.player_id
    WHERE m.league_id = @LeagueID
    GROUP BY gs.player_id, p.name
    ORDER BY TotalGoals DESC, TotalAssists DESC;
END;





--- Testing
EXEC PR_UpdateGameStatistics;
 

EXEC PR_GetPlayerStatistics @PlayerID = 6;


