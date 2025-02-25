Feature: Quorum during countdown

  Scenario: Reaching starting quorum: player joined
    Given At most one player is in a game
    When A player joins the game
    Then The game starts counting down

  Scenario: Reaching starting quorum: multiple players
    Given At least two players are in a game
    And The game is not counting down
    And The game has not started yet
    Then The game starts counting down

  Scenario: Reaching starting quorum: players and spectators
    Given At least one player is in a game
    And At least one spectator is in the game
    And The game is not counting down
    And The game has not started yet
    Then The spectators are moved to players
    And The game starts counting down

  Scenario: Losing starting quorum
    Given At most two players are in a game
    And The game is counting down before the start
    When A player leaves the game
    Then The game stops counting down

  Scenario: Maintaining starting quorum: player left
    Given At least three players are in a game
    And The game is counting down before the start
    When A player leaves the game
    Then The game continues counting down

  Scenario: Maintaining starting quorum: player joined
    Given At least two players are in a game
    And The game is counting down before the start
    When A player joins the game
    Then The game continues counting down
