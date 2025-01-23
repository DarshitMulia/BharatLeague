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
    -- Ensure team1_id and team2_id are not the same
    IF (@team1_id = @team2_id)
    BEGIN
        THROW 51000, 'Team1 and Team2 cannot be the same.', 1;
    END;

    -- Insert match details into the Match table
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
    IF NOT EXISTS (SELECT 1 FROM Match WHERE match_id = @match_id)
    BEGIN
        RAISERROR ('Match with ID %d not found.', 16, 1, @match_id);
        RETURN;
    END

    UPDATE Match
    SET team1_id = @team1_id,
        team2_id = @team2_id,
		match_date = @match_date,
		start_time = @start_time,
        venue = @venue,
        updated_at = GETDATE()
    WHERE match_id = @match_id;
END;


-- Procedure to Delete a Match
/* CREATE PROCEDURE PR_DeleteMatch
    @MatchID INT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Match WHERE match_id = @MatchID)
    BEGIN
        RAISERROR ('Match not found.', 16, 1);
        RETURN;
    END

    DELETE FROM Match
    WHERE match_id = @MatchID;
END; */


-- Procedure to Retrieve Matches by League
CREATE PROCEDURE PR_GetMatchesByLeague
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