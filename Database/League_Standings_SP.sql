-- To Update League Standings Automatically After Match Ends  (Chat GPT says when the status of the match gets 'Completed' it automatically updates the league standings)
CREATE PROCEDURE PR_UpdateLeagueStandings
    @match_id INT
AS
BEGIN
    DECLARE @team1_id INT, @team2_id INT, @team1_score INT, @team2_score INT, @league_id INT;

    -- Fetch match details
    SELECT 
        @team1_id = team1_id, 
        @team2_id = team2_id, 
        @team1_score = team1_score, 
        @team2_score = team2_score, 
        @league_id = league_id
    FROM Match
    WHERE match_id = @match_id;

    -- Update League Standings for Team 1
    UPDATE LeagueStandings
    SET 
        matches_played = matches_played + 1,
        goals_scored = goals_scored + @team1_score,
        goals_conceded = goals_conceded + @team2_score,
        goals_difference = goals_scored - goals_conceded,
        -- Points update based on result
        points = CASE 
                    WHEN @team1_score > @team2_score THEN points + 3 -- Team 1 wins
                    WHEN @team1_score = @team2_score THEN points + 1 -- Draw
                    ELSE points -- No change for loss
                 END,
        wins = CASE 
                 WHEN @team1_score > @team2_score THEN wins + 1
                 ELSE wins 
              END,
        losses = CASE 
                   WHEN @team1_score < @team2_score THEN losses + 1
                   ELSE losses 
                END,
        draws = CASE 
                  WHEN @team1_score = @team2_score THEN draws + 1
                  ELSE draws 
               END
    WHERE league_id = @league_id AND team_id = @team1_id;

    -- Update League Standings for Team 2
    UPDATE LeagueStandings
    SET 
        matches_played = matches_played + 1,
        goals_scored = goals_scored + @team2_score,
        goals_conceded = goals_conceded + @team1_score,
        goals_difference = goals_scored - goals_conceded,
        -- Points update based on result
        points = CASE 
                    WHEN @team2_score > @team1_score THEN points + 3 -- Team 2 wins
                    WHEN @team1_score = @team2_score THEN points + 1 -- Draw
                    ELSE points -- No change for loss
                 END,
        wins = CASE 
                 WHEN @team2_score > @team1_score THEN wins + 1
                 ELSE wins 
              END,
        losses = CASE 
                   WHEN @team2_score < @team1_score THEN losses + 1
                   ELSE losses 
                END,
        draws = CASE 
                  WHEN @team1_score = @team2_score THEN draws + 1
                  ELSE draws 
               END
    WHERE league_id = @league_id AND team_id = @team2_id;
END


-- Procedure to get all the league standings for all teams in a particular league
CREATE PROCEDURE PR_GetLeagueStandingsByLeagueId
    @league_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        ls.league_id,
        l.leaguename,
        ls.team_id,
        t.teamname,
        ls.matches_played,
        ls.wins,
        ls.losses,
        ls.draws,
        ls.points,
        ls.goals_scored,
        ls.goals_conceded,
        ls.goals_difference,
        ls.created_at,
        ls.updated_at
    FROM LeagueStandings ls
    INNER JOIN League l ON ls.league_id = l.league_id
    INNER JOIN Team t ON ls.team_id = t.team_id
    WHERE ls.league_id = @league_id
    ORDER BY ls.points DESC, ls.goals_difference DESC;
END;
