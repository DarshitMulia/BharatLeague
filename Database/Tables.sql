-- Create Database
CREATE DATABASE Bharat_League;

-- Table: Users
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(200) NOT NULL,
    role NVARCHAR(20) CHECK (role IN ('Admin', 'User')), 
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Table: League
CREATE TABLE League (
    league_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    leaguename NVARCHAR(100) NOT NULL UNIQUE,
    image_url NVARCHAR(MAX), 
    country NVARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL, 
    status AS (
        CASE 
            WHEN start_date > GETDATE() THEN 'Scheduled' 
            WHEN GETDATE() BETWEEN start_date AND end_date THEN 'Ongoing' 
            ELSE 'Completed' 
        END
    ),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);


-- Table: Team
CREATE TABLE Team (
    team_id INT PRIMARY KEY IDENTITY(1,1),
    league_id INT NOT NULL FOREIGN KEY REFERENCES League(league_id),
    teamname NVARCHAR(100) NOT NULL,
	image_url NVARCHAR(MAX), 
    city NVARCHAR(50),
    coach_name NVARCHAR(50),
    founded_year INT CHECK (founded_year > 1800 AND founded_year <= YEAR(GETDATE())),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    UNIQUE (league_id, teamname)
);


-- Table: Player
CREATE TABLE Player (
    player_id INT PRIMARY KEY IDENTITY(1,1),
    team_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    playername NVARCHAR(100) NOT NULL,
	image_url NVARCHAR(MAX),
    age INT CHECK (age > 0 AND age <= 100),
    jersey_number INT CHECK (jersey_number BETWEEN 1 AND 99),
    position NVARCHAR(50) CHECK (role IN ('Forward', 'Midfielder', 'Defender', 'Goalkeeper')),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);


-- Table: Match
CREATE TABLE Match (
    match_id INT PRIMARY KEY IDENTITY(1,1),
    league_id INT NOT NULL FOREIGN KEY REFERENCES League(league_id),
    team1_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    team2_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    match_date DATE NOT NULL,
    start_time DATETIME NOT NULL, -- New column for start time
    venue NVARCHAR(100) NOT NULL,
    team1_score INT DEFAULT 0,
    team2_score INT DEFAULT 0,
    status AS (
        CASE 
            WHEN start_time > GETDATE() THEN 'Scheduled' 
            WHEN GETDATE() BETWEEN start_time AND DATEADD(HOUR, 2, start_time) THEN 'Ongoing' 
            ELSE 'Completed' 
        END
    ),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CHECK (team1_id <> team2_id)
);


-- Table: MatchEventLogs
CREATE TABLE MatchEventLogs (
    event_id INT PRIMARY KEY IDENTITY(1,1),
    match_id INT NOT NULL FOREIGN KEY REFERENCES Match(match_id),
    team_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    player_id INT NOT NULL FOREIGN KEY REFERENCES Player(player_id),
    event_type NVARCHAR(50) CHECK (event_type IN ('Goal', 'Assist', 'Yellow Card', 'Red Card', 'Foul')),
    event_time NVARCHAR(10) NOT NULL, 
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);


-- Table: PlayerActions
CREATE TABLE PlayerActions (
    match_id INT NOT NULL FOREIGN KEY REFERENCES Match(match_id),
    team_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    player_id INT NOT NULL FOREIGN KEY REFERENCES Player(player_id),
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    fouls INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (match_id, team_id, player_id)  
);


-- Table: PlayerStatistics
CREATE TABLE PlayerStatistics (
    player_id INT PRIMARY KEY FOREIGN KEY REFERENCES Player(player_id),
    matches_played INT DEFAULT 0,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    fouls INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);


-- Table: League Standings
CREATE TABLE LeagueStandings (
    standing_id INT PRIMARY KEY IDENTITY(1,1),
    league_id INT NOT NULL FOREIGN KEY REFERENCES League(league_id),
    team_id INT NOT NULL FOREIGN KEY REFERENCES Team(team_id),
    matches_played INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    draws INT DEFAULT 0,
    points INT DEFAULT 0,
    goals_scored INT DEFAULT 0,
    goals_conceded INT DEFAULT 0,
    goals_difference AS (goals_scored - goals_conceded),
    UNIQUE (league_id, team_id)
);





INSERT INTO Users (username, email, password, role) 
VALUES 
('admin', 'admin@example.com', 'admin123', 'Admin'),
('user1', 'user1@example.com', 'user123', 'User'),
('user2', 'user2@example.com', 'user123', 'User');

INSERT INTO League (user_id, name, country, start_date, end_date)
VALUES
(1, 'Premier League', 'England', '2024-01-01', '2024-05-31'),
(1, 'La Liga', 'Spain', '2024-01-01', NULL);

INSERT INTO Team (league_id, name, city, coach_name, founded_year)
VALUES 
(1, 'Manchester United', 'Manchester', 'Erik ten Hag', 1878),
(1, 'Liverpool FC', 'Liverpool', 'Jürgen Klopp', 1892),
(2, 'Real Madrid', 'Madrid', 'Carlo Ancelotti', 1902),
(2, 'Barcelona', 'Barcelona', 'Xavi Hernandez', 1899);

INSERT INTO Player (team_id, name, age, jersey_number, position)
VALUES
(1, 'Bruno Fernandes', 29, 18, 'Midfielder'),
(1, 'Marcus Rashford', 26, 10, 'Forward'),
(2, 'Mohamed Salah', 31, 11, 'Forward'),
(2, 'Virgil van Dijk', 32, 4, 'Defender'),
(3, 'Karim Benzema', 36, 9, 'Forward'),
(4, 'Robert Lewandowski', 35, 9, 'Forward');

INSERT INTO Match (league_id, team1_id, team2_id, match_date, venue, status)
VALUES
(1, 1, 2, '2024-01-10', 'Old Trafford', 'Scheduled'),
(1, 3, 4, '2024-01-11', 'Santiago Bernabeu', 'Scheduled'),
(2, 3, 4, '2024-02-01', 'Camp Nou', 'Scheduled');

INSERT INTO PlayerActions (match_id, team_id, player_id, goals, assists, fouls, yellow_cards, red_cards)
VALUES
(1, 1, 1, 1, 0, 2, 1, 0),
(1, 2, 3, 1, 1, 1, 0, 0),
(2, 3, 5, 2, 1, 1, 0, 0),
(2, 4, 6, 1, 1, 0, 1, 0),
(3, 3, 5, 1, 0, 1, 0, 0),
(3, 4, 6, 1, 1, 1, 0, 0);

INSERT INTO Game_Statistics (match_id, player_id, goals, assists, fouls, yellow_cards, red_cards)
VALUES
(1, 1, 1, 0, 2, 1, 0),
(1, 3, 1, 1, 1, 0, 0),
(2, 5, 2, 1, 1, 0, 0),
(2, 6, 1, 1, 0, 1, 0),
(3, 5, 1, 0, 1, 0, 0),
(3, 6, 1, 1, 1, 0, 0);





select * from Users

select * from League

select * from Team

select * from Player

select * from Match

select * from PlayerActions

select * from League_Standings

select * from Game_Statistics