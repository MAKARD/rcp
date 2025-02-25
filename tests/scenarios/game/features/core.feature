Feature: Game core

  Scenario: Creating game
    Given A user made a POST /create request
    Then The user receives the created game ID in response

  Scenario: Starting game
    Given At least two players are in a game
    And The game has finished counting down
    Then The game starts with all joined players

  Scenario: Playing multiple games
    Given At least two games have been created
    And All games have reached their starting quorum
    When The games start
    Then Each game progresses independently