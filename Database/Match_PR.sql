-- Stored Procedures for Match Table

-- Procedure to Add a Match
CREATE PROCEDURE PR_AddMatch
    @league_id INT,
    @team1_id INT,
    @team2_id INT,
    @match_date DATE,
    @start_time TIME,
    @venue NVARCHAR(100)
AS
BEGIN
    INSERT INTO Match (league_id, team1_id, team2_id, match_date, start_time, venue, created_at, updated_at)
    VALUES (@league_id, @team1_id, @team2_id, @match_date, @start_time, @venue, GETDATE(), GETDATE());
END;


-- Procedure to Update Match Details
CREATE PROCEDURE PR_UpdateMatch
	@match_id INT,
    @league_id INT,
    @team1_id INT,
    @team2_id INT,
    @match_date DATE,
    @start_time TIME,
    @venue NVARCHAR(100)
AS
BEGIN
    UPDATE Match
    SET team1_id = @team1_id,
        team2_id = @team2_id,
		match_date = @match_date,
		start_time = @start_time,
        venue = @venue,
        updated_at = GETDATE()
    WHERE match_id = @match_id;
END;


-- Procedure to get all matches
CREATE PROCEDURE PR_GetAllMatches
AS
BEGIN
	Select * from Match
END


-- Procedure to mark a match as Ongoing
CREATE PROCEDURE PR_MarkMatchOngoing
    @match_id INT
AS
BEGIN
    UPDATE Match
    SET status = 'Ongoing',
        updated_at = GETDATE()
    WHERE match_id = @match_id;
END;


-- Procedure to Get Ongoing Matches
CREATE PROCEDURE PR_GetOngoingMatches
AS
BEGIN
    SELECT * FROM Match
    WHERE status = 'Ongoing';
END;


-- Procedure to Retrieve Matches by League
CREATE PROCEDURE PR_GetMatchesByLeagueID
    @league_id INT
AS
BEGIN
    SELECT * FROM Match
    WHERE league_id = @league_id;
END;


-- Procedure to Get Scheduled Matches by league
CREATE PROCEDURE PR_GetScheduledMatchesByLeague
    @leagueId INT
AS
BEGIN
    SELECT * FROM Match
    WHERE league_id = @leagueId AND status = 'Scheduled';
END;


-- Procedure to Get Ongoing Matches by league
CREATE PROCEDURE PR_GetOngoingMatchesByLeague
    @leagueId INT
AS
BEGIN
    SELECT * FROM Match
    WHERE league_id = @leagueId AND status = 'Ongoing';
END;


-- Procedure to Get Completed Matches by league
CREATE PROCEDURE PR_GetCompletedMatchesByLeague
    @leagueId INT
AS
BEGIN
    SELECT * FROM Match
    WHERE league_id = @leagueId AND status = 'Completed';
END;


-- Procedure to Retrieve Match by ID
CREATE PROCEDURE PR_GetMatchByID
    @match_id INT
AS
BEGIN
    SELECT * FROM Match
    WHERE match_id = @match_id;
END;


-- Procedure to Search Matches by TeamName or Venue
CREATE PROCEDURE PR_SearchMatches
    @TeamName NVARCHAR(100) = NULL,
    @Venue NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        m.match_id,
        m.league_id,
        m.team1_id, 
        t1.teamname AS team1_name,
        m.team2_id, 
        t2.teamname AS team2_name,
        m.match_date,
        m.start_time,
        m.venue,
        m.status
    FROM [Match] m
    INNER JOIN Team t1 ON m.team1_id = t1.team_id
    INNER JOIN Team t2 ON m.team2_id = t2.team_id
    WHERE m.status = 'Ongoing'
      AND (
            (@TeamName IS NOT NULL AND (t1.teamname LIKE '%' + @TeamName + '%' OR t2.teamname LIKE '%' + @TeamName + '%'))
         OR (@Venue IS NOT NULL AND m.venue LIKE '%' + @Venue + '%')
         OR (@TeamName IS NULL AND @Venue IS NULL)
      );
END;
