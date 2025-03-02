-- Procedure to update league Standings of a league
CREATE PROCEDURE PR_UpdateLeagueStandingsFromMatch
    @match_id INT,
    @league_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @team1_id INT, 
            @team2_id INT,
            @team1_goals INT = 0,
            @team2_goals INT = 0,
            @team1_points INT = 0,
            @team2_points INT = 0,
            @team1_win INT = 0,
            @team2_win INT = 0,
            @team1_loss INT = 0,
            @team2_loss INT = 0,
            @draw INT = 0;

    -- Verify the match belongs to the provided league_id
    IF NOT EXISTS (SELECT 1 FROM Match WHERE match_id = @match_id AND league_id = @league_id)
    BEGIN
        RAISERROR('Match does not belong to the specified league.', 16, 1);
        RETURN;
    END

    -- Retrieve team IDs from the Match table
    SELECT 
        @team1_id = team1_id,
        @team2_id = team2_id
    FROM Match
    WHERE match_id = @match_id;

    -- Calculate the goals scored by each team in the match
    SELECT @team1_goals = COUNT(*)
    FROM MatchEvents
    WHERE match_id = @match_id 
      AND team_id = @team1_id 
      AND event_type = 'Goal';

    SELECT @team2_goals = COUNT(*)
    FROM MatchEvents
    WHERE match_id = @match_id 
      AND team_id = @team2_id 
      AND event_type = 'Goal';

    -- Determine match outcome and assign points and win/loss/draw flags
    IF @team1_goals > @team2_goals
    BEGIN
        SET @team1_points = 3;
        SET @team1_win = 1;
        SET @team2_loss = 1;
    END
    ELSE IF @team1_goals < @team2_goals
    BEGIN
        SET @team2_points = 3;
        SET @team2_win = 1;
        SET @team1_loss = 1;
    END
    ELSE
    BEGIN
        SET @team1_points = 1;
        SET @team2_points = 1;
        SET @draw = 1;
    END

    -- Update or insert LeagueStandings for team1
    IF EXISTS (SELECT 1 FROM LeagueStandings WHERE league_id = @league_id AND team_id = @team1_id)
    BEGIN
        UPDATE LeagueStandings
        SET 
            matches_played = matches_played + 1,
            wins = wins + @team1_win,
            losses = losses + @team1_loss,
            draws = draws + @draw,
            points = points + @team1_points,
            goals_scored = goals_scored + @team1_goals,
            goals_conceded = goals_conceded + @team2_goals
        WHERE league_id = @league_id AND team_id = @team1_id;
    END
    ELSE
    BEGIN
        INSERT INTO LeagueStandings 
        (
            league_id, 
            team_id, 
            matches_played, 
            wins, 
            losses, 
            draws, 
            points, 
            goals_scored, 
            goals_conceded
        )
        VALUES 
        (
            @league_id, 
            @team1_id, 
            1, 
            @team1_win, 
            @team1_loss, 
            @draw, 
            @team1_points, 
            @team1_goals, 
            @team2_goals
        );
    END

    -- Update or insert LeagueStandings for team2
    IF EXISTS (SELECT 1 FROM LeagueStandings WHERE league_id = @league_id AND team_id = @team2_id)
    BEGIN
        UPDATE LeagueStandings
        SET 
            matches_played = matches_played + 1,
            wins = wins + @team2_win,
            losses = losses + @team2_loss,
            draws = draws + @draw,
            points = points + @team2_points,
            goals_scored = goals_scored + @team2_goals,
            goals_conceded = goals_conceded + @team1_goals
        WHERE league_id = @league_id AND team_id = @team2_id;
    END
    ELSE
    BEGIN
        INSERT INTO LeagueStandings 
        (
            league_id, 
            team_id, 
            matches_played, 
            wins, 
            losses, 
            draws, 
            points, 
            goals_scored, 
            goals_conceded
        )
        VALUES 
        (
            @league_id, 
            @team2_id, 
            1, 
            @team2_win, 
            @team2_loss, 
            @draw, 
            @team2_points, 
            @team2_goals, 
            @team1_goals
        );
    END
END;



-- Procedure to get league Standings of a league
CREATE PROCEDURE PR_GetLeagueStandingsOfALeague
    @league_id INT
AS
BEGIN
    SELECT
        ls.standing_id,
        ls.league_id,
        ls.team_id,
        t.teamname AS TeamName,  
        ls.matches_played,
        ls.wins,
        ls.losses,
        ls.draws,
        ls.goals_scored,
        ls.goals_conceded,
        ls.goals_difference,
        ls.points,
        ls.created_at,
        ls.updated_at
    FROM LeagueStandings AS ls
    INNER JOIN Team AS t 
        ON ls.team_id = t.team_id
    WHERE ls.league_id = @league_id
    ORDER BY ls.points DESC,
             ls.goals_difference DESC,
             ls.goals_scored DESC;
END;
