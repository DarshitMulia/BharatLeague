-- This procedure will add player actions (e.g., goals, assists, fouls, yellow cards, red cards) for a specific match.
CREATE PROCEDURE PR_AddPlayerAction
    @match_id INT,
    @team_id INT,
    @player_id INT,
    @goals INT = 0,
    @assists INT = 0,
    @fouls INT = 0,
    @yellow_cards INT = 0,
    @red_cards INT = 0
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert or update player action
    IF EXISTS (SELECT 1 FROM PlayerActions WHERE match_id = @match_id AND team_id = @team_id AND player_id = @player_id)
    BEGIN
        -- Update existing player action
        UPDATE PlayerActions
        SET goals = goals + @goals,
            assists = assists + @assists,
            fouls = fouls + @fouls,
            yellow_cards = yellow_cards + @yellow_cards,
            red_cards = red_cards + @red_cards,
            updated_at = GETDATE()
        WHERE match_id = @match_id AND team_id = @team_id AND player_id = @player_id;
    END
    ELSE
    BEGIN
        -- Insert new player action
        INSERT INTO PlayerActions (match_id, team_id, player_id, goals, assists, fouls, yellow_cards, red_cards, created_at, updated_at)
        VALUES (@match_id, @team_id, @player_id, @goals, @assists, @fouls, @yellow_cards, @red_cards, GETDATE(), GETDATE());
    END
END;


-- This procedure retrieves all actions of all players in a specific match.
CREATE PROCEDURE PR_GetPlayerActionsByMatch
    @match_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM PlayerActions
    WHERE match_id = @match_id
    ORDER BY team_id, player_id;
END;


-- This procedure retrieves all actions for a specific player across multiple matches
CREATE PROCEDURE PR_GetPlayerActionsByPlayer
    @player_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM PlayerActions
    WHERE player_id = @player_id
    ORDER BY match_id;
END;



/* CREATE PROCEDURE Update_PlayerActionsInAMatch
    @match_id INT,
    @team_id INT,
    @player_id INT,
    @goals INT = NULL,
    @assists INT = NULL,
    @fouls INT = NULL,
    @yellow_cards INT = NULL,
    @red_cards INT = NULL
AS
BEGIN
    -- Check if the player action exists
    IF EXISTS (SELECT 1 FROM PlayerActions WHERE match_id = @match_id AND team_id = @team_id AND player_id = @player_id)
    BEGIN
        -- Update the player action details
        UPDATE PlayerActions
        SET goals = ISNULL(@goals, goals),
            assists = ISNULL(@assists, assists),
            fouls = ISNULL(@fouls, fouls),
            yellow_cards = ISNULL(@yellow_cards, yellow_cards),
            red_cards = ISNULL(@red_cards, red_cards),
            updated_at = GETDATE()
        WHERE match_id = @match_id AND team_id = @team_id AND player_id = @player_id;
    END
    ELSE
    BEGIN
        -- Throw an error if the action does not exist
        THROW 51000, 'Player action for the given match, team, and player does not exist.', 1;
    END
END; */

-- This procedure deletes a player action entry from the table (useful for undoing actions or corrections).
/* CREATE PROCEDURE PR_DeletePlayerAction
    @match_id INT,
    @team_id INT,
    @player_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM PlayerActions
    WHERE match_id = @match_id AND team_id = @team_id AND player_id = @player_id;
END; */
