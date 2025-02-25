Feature: Quorum during active game

  Scenario: Losing starting quorum: one player left
    Given At most two players are in an active game
    When A player leaves the game
    Then The game stops
    And The remaining player is declared the winner

  Scenario: Losing starting quorum: no players left
    Given At least two players are in an active game
    When All players leave the game
    Then The game stops
    And The game declares a draw

  Scenario: Maintaining starting quorum: player left
    Given At least three players are in an active game
    When A player leaves the game
    Then The game continues with the remaining players

  Scenario: Maintaining starting quorum: player joined
    Given At least two players are in an active game
    When A player joins the game
    Then The game continues with the initially joined players
    And The joined player becomes a spectator

  Scenario: Maintaining starting quorum: spectator left
    Given At least two players are in an active game
    And At least one spectator is in the active game
    When A spectator leaves the game
    Then The game continues with the initially joined players