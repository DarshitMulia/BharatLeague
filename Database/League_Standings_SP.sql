-- Stored Procedures for League_Standings Table

-- Procedure to Get Standings for a League	
CREATE PROCEDURE PR_GetLeagueStandings
    @LeagueID INT
AS
BEGIN
    SELECT ls.standing_id, t.name, ls.matches_played, ls.wins, ls.losses, ls.draws, ls.points, 
           ls.goals_scored, ls.goals_conceded, ls.goals_difference
    FROM League_Standings ls
    JOIN Team t ON ls.team_id = t.team_id
    WHERE ls.league_id = @LeagueID
    ORDER BY ls.points DESC, ls.goals_difference DESC, t.name ASC;
END;


-- Procedure to Get Standings for a Team in a Specific League
CREATE PROCEDURE PR_GetTeamStandings
    @LeagueID INT,
    @TeamID INT
AS
BEGIN
    SELECT ls.standing_id, t.name, ls.matches_played, ls.wins, ls.losses, ls.draws, ls.points, 
           ls.goals_scored, ls.goals_conceded, ls.goals_difference
    FROM League_Standings ls
    JOIN Team t ON ls.team_id = t.team_id
    WHERE ls.league_id = @LeagueID AND ls.team_id = @TeamID;
END;


-- Procedure to Update the Standings for a League
CREATE PROCEDURE PR_UpdateLeagueStandings
    @MatchID INT
AS
BEGIN
    DECLARE @Team1ID INT, @Team2ID INT, @Team1Score INT, @Team2Score INT, @LeagueID INT;
    SELECT 
        @Team1ID = team1_id, 
        @Team2ID = team2_id, 
        @Team1Score = team1_score, 
        @Team2Score = team2_score,
        @LeagueID = league_id
    FROM [Match]
    WHERE match_id = @MatchID;
    IF EXISTS (SELECT 1 FROM League_Standings WHERE league_id = @LeagueID AND team_id = @Team1ID)
    BEGIN
        UPDATE League_Standings
        SET 
            matches_played = matches_played + 1,
            wins = wins + CASE WHEN @Team1Score > @Team2Score THEN 1 ELSE 0 END,
            losses = losses + CASE WHEN @Team1Score < @Team2Score THEN 1 ELSE 0 END,
            draws = draws + CASE WHEN @Team1Score = @Team2Score THEN 1 ELSE 0 END,
            goals_scored = goals_scored + @Team1Score,
            goals_conceded = goals_conceded + @Team2Score,
            points = points + CASE 
                                WHEN @Team1Score > @Team2Score THEN 3 
                                WHEN @Team1Score = @Team2Score THEN 1 
                                ELSE 0 
                              END
        WHERE league_id = @LeagueID AND team_id = @Team1ID;
    END
    ELSE
    BEGIN
        INSERT INTO League_Standings (league_id, team_id, matches_played, wins, losses, draws, points, goals_scored, goals_conceded)
        VALUES
        (
            @LeagueID, 
            @Team1ID, 
            1, 
            CASE WHEN @Team1Score > @Team2Score THEN 1 ELSE 0 END, 
            CASE WHEN @Team1Score < @Team2Score THEN 1 ELSE 0 END, 
            CASE WHEN @Team1Score = @Team2Score THEN 1 ELSE 0 END, 
            CASE WHEN @Team1Score > @Team2Score THEN 3 ELSE 
                 CASE WHEN @Team1Score = @Team2Score THEN 1 ELSE 0 END END, 
            @Team1Score, 
            @Team2Score
        );
    END;
    IF EXISTS (SELECT 1 FROM League_Standings WHERE league_id = @LeagueID AND team_id = @Team2ID)
    BEGIN
        UPDATE League_Standings
        SET 
            matches_played = matches_played + 1,
            wins = wins + CASE WHEN @Team2Score > @Team1Score THEN 1 ELSE 0 END,
            losses = losses + CASE WHEN @Team2Score < @Team1Score THEN 1 ELSE 0 END,
            draws = draws + CASE WHEN @Team2Score = @Team1Score THEN 1 ELSE 0 END,
            goals_scored = goals_scored + @Team2Score,
            goals_conceded = goals_conceded + @Team1Score,
            points = points + CASE 
                                WHEN @Team2Score > @Team1Score THEN 3 
                                WHEN @Team2Score = @Team1Score THEN 1 
                                ELSE 0 
                              END
        WHERE league_id = @LeagueID AND team_id = @Team2ID;
    END
    ELSE
    BEGIN
        INSERT INTO League_Standings (league_id, team_id, matches_played, wins, losses, draws, points, goals_scored, goals_conceded)
        VALUES
        (
            @LeagueID, 
            @Team2ID, 
            1, 
            CASE WHEN @Team2Score > @Team1Score THEN 1 ELSE 0 END, 
            CASE WHEN @Team2Score < @Team1Score THEN 1 ELSE 0 END, 
            CASE WHEN @Team2Score = @Team1Score THEN 1 ELSE 0 END, 
            CASE WHEN @Team2Score > @Team1Score THEN 3 ELSE 
                 CASE WHEN @Team2Score = @Team1Score THEN 1 ELSE 0 END END, 
            @Team2Score, 
            @Team1Score
        );
    END;
END;


-- Procedure to Automatically Populate Standings for a New League
ALTER PROCEDURE PR_PopulateStandingsForNewLeague
    @LeagueID INT
AS
BEGIN
    DECLARE @TeamID INT;

    -- Cursor to loop through all teams in the league
    DECLARE team_cursor CURSOR FOR
    SELECT team_id
    FROM Team
    WHERE league_id = @LeagueID;

    OPEN team_cursor;
    FETCH NEXT FROM team_cursor INTO @TeamID;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM League_Standings WHERE league_id = @LeagueID AND team_id = @TeamID)
        BEGIN
            INSERT INTO League_Standings (league_id, team_id, matches_played, wins, losses, draws, points, goals_scored, goals_conceded)
            VALUES (@LeagueID, @TeamID, 0, 0, 0, 0, 0, 0, 0);
        END

        FETCH NEXT FROM team_cursor INTO @TeamID;
    END;

    CLOSE team_cursor;
    DEALLOCATE team_cursor;
END;


-- Procedure to Get the Standings for All Leagues
-- CREATE PROCEDURE PR_GetAllLeaguesStandings
-- AS
-- BEGIN
--    SELECT ls.league_id, l.name AS league_name, t.team_name, ls.matches_played, ls.wins, ls.losses, ls.draws, ls.points, 
--           ls.goals_scored, ls.goals_conceded, ls.goals_difference
--    FROM League_Standings ls
--    JOIN League l ON ls.league_id = l.league_id
--    JOIN Team t ON ls.team_id = t.team_id
--    ORDER BY ls.league_id, ls.points DESC, ls.goals_difference DESC;
-- END;





---> Testing
EXEC PR_GetLeagueStandings @LeagueID = 2;


EXEC PR_GetTeamStandings @LeagueID = 2, @TeamID = 3;


EXEC PR_PopulateStandingsForNewLeague @LeagueID = 2;


EXEC PR_CalculatePointsOfLeagueByID @LeagueID = 2;