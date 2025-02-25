Feature: Players joining

  Scenario: One player
    Given A player connected to the socket gateway
    When The player emits the 'player/join' event
    Then The player joins the game they passed in params

  Scenario: N+1 players
    Given At least one player is already in a game
    And A player connected to the socket gateway
    When The player emits the 'player/join' event
    Then The player joins the game they passed in params
