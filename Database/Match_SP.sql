-- Stored Procedures for Match Table

-- Procedure to Add a Match
CREATE PROCEDURE PR_AddMatch
    @league_id INT,
    @team1_id INT,
    @team2_id INT,
    @match_date DATE,
    @start_time DATETIME,
    @venue NVARCHAR(100)
AS
BEGIN
    INSERT INTO Match (league_id, team1_id, team2_id, match_date, start_time, venue, created_at, updated_at)
    VALUES (@league_id, @team1_id, @team2_id, @match_date, @start_time, @venue, GETDATE(), GETDATE());
END;


-- Procedure to Get All the Matches
CREATE PROCEDURE PR_GetAllMatches
AS
BEGIN
    SELECT * FROM Match;
END;


-- Procedure to Update Match Details
CREATE PROCEDURE PR_UpdateMatch
	@match_id INT,
    @league_id INT,
    @team1_id INT,
    @team2_id INT,
    @match_date DATE,
    @start_time DATETIME,
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


-- Procedure to Retrieve Matches by League
CREATE PROCEDURE PR_GetMatchesByLeagueID
    @league_id INT
AS
BEGIN
    SELECT * FROM Match
    WHERE league_id = @league_id;
END;


-- Procedure to Retrieve Match by ID
CREATE PROCEDURE PR_GetMatchByID
    @match_id INT
AS
BEGIN
    SELECT * FROM Match
    WHERE match_id = @match_id;
END;


-- Procedure to Search Matches by Teams or Venue
CREATE PROCEDURE PR_SearchMatches
    @search NVARCHAR(100)
AS
BEGIN
    SELECT match_id, league_id, team1_id, team2_id, match_date, start_time, venue, status, created_at, updated_at
    FROM Match
    WHERE venue LIKE '%' + @search + '%' OR
          status LIKE '%' + @search + '%';
END;