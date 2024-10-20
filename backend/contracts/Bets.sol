// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "./Disable.sol";
// import "./Oracle.sol";

// //TODO: cache matches so that we don't have to keep calling another contract (does it waste gas?)

// contract Bets is Disableable {

//     //boxing results oracle 
//     address internal boxingOracleAddr = 0x6Dca9BB7dA4c09930A466956E0A3e3F7fee1ef7D;
//     Oracle internal boxingOracle = Oracle(boxingOracleAddr); 

//     //constants
    
//     //mappings 
//     mapping(address => bytes32[]) internal userToBets;
//     mapping(bytes32 => Bet[]) internal matchToBets;
//     mapping(bytes32 => bool) internal matchPaidOut; 
//     mapping(bytes32 => mapping(uint8 => uint)) internal matchPools;

//     struct Bet {
//         address user;
//         bytes32 matchId;
//         uint amount; 
//         uint8 chosenWinner; 
//     }

//     /// @notice determines whether or not the user has already bet on the given match
//     /// @param _user address of a user
//     /// @param _matchId id of a match 
//     /// @param _chosenWinner the index of the participant to bet on (to win)
//     /// @return true if the given user has already placed a bet on the given match 
//     // function _betIsValid(address _user, bytes32 _matchId, uint8 _chosenWinner) private view returns (bool) {

//     //     //ensure that user hasn't already bet on match 
//     //     bytes32[] storage userBets = userToBets[_user]; 
//     //     if (userBets.length > 0) {
//     //         for (uint n = 0; n < userBets.length; n++) {
//     //             if (userBets[n] == _matchId) {
//     //                 //user has already bet on match 
//     //                 return false;
//     //             }
//     //         }
//     //     }

//     //     //ensure that bet is valid for the match 
//     //     //TODO: combine this with other validation so that match is only gotten once 
//     //     uint8 participantCount; 
//     //     (,,,participantCount,,,) = boxingOracle.getMatch(_matchId);
//     //     if (_chosenWinner >= participantCount)
//     //         return false;

//     //     return true;
//     // }

//     /// @notice determines whether or not bets may still be accepted for the given match
//     /// @param _matchId id of a match 
//     /// @return true if the match is bettable 
//     function _matchOpenForBetting(bytes32 _matchId) private view returns (bool) {
//         Oracle.MatchOutcome outcome; 
//         (,,,,,outcome,) = getMatch(_matchId);
//         return outcome == Oracle.MatchOutcome.Pending;
//     }


//     /// @notice sets the address of the boxing oracle contract to use 
//     /// @dev setting a wrong address may result in false return value, or error 
//     /// @param _oracleAddress the address of the boxing oracle 
//     /// @return true if connection to the new oracle address was successful
//     function setOracleAddress(address _oracleAddress) external onlyOwner returns (bool) {
//         boxingOracleAddr = _oracleAddress;
//         boxingOracle = Oracle(boxingOracleAddr); 
//         return boxingOracle.testConnection();
//     }

//     /// @notice gets the address of the boxing oracle being used 
//     /// @return the address of the currently set oracle 
//     function getOracleAddress() external view returns (address) {
//         return boxingOracleAddr;
//     }

//     /// @notice gets a list ids of all currently bettable matches
//     /// @return array of match ids 
//     function getBettableMatches() public view returns (bytes32[] memory) {
//         return boxingOracle.getPendingMatches(); 
//     }

//     /// @notice gets a list ids of all matches
//     /// @return array of match ids 
//     function getMatches() public view returns (bytes32[] memory) {
//         return boxingOracle.getAllMatches(); 
//     }

//     function getMatch(bytes32 _matchId) public view returns (
//         bytes32 id,
//         string memory name, 
//         string memory participants,
//         uint8 participantCount,
//         uint date, 
//         Oracle.MatchOutcome outcome, 
//         int8 winner) { 

//         return boxingOracle.getMatch(_matchId); 
//     }

//     function getMostRecentMatch() public view returns (
//         bytes32 id,
//         string memory name, 
//         string memory participants,
//         uint participantCount, 
//         uint date, 
//         Oracle.MatchOutcome outcome, 
//         int8 winner) { 

//         return boxingOracle.getMostRecentMatch(true); 
//     }

//     /// @notice gets the current matches on which the user has bet 
//     /// @return array of match ids 
//     function getUserBets() public view returns (bytes32[] memory) {
//         return userToBets[msg.sender];
//     }
    
//     function getUserBet(bytes32 _matchId) public view returns (uint amount, uint8 winner) { 
//         Bet[] storage bets = matchToBets[_matchId]; 
//         for (uint n = 0; n < bets.length; n++) {
//             if (bets[n].user == msg.sender) {
//                 return (bets[n].amount, bets[n].chosenWinner);
//             }
//         }
//         return (0, 0); 
//     }
//     /// @notice places a non-rescindable bet on the given match 
//     /// @param _matchId the id of the match on which to bet 
//     /// @param _chosenWinner the index of the participant chosen as winner
//     function placeBet(bytes32 _matchId, uint8 _chosenWinner) public payable notDisabled {

//         //bet must be above a certain minimum 
//         require(msg.value >= minimumBet);

//         //make sure that match exists 
//         require(boxingOracle.matchExists(_matchId)); 

//         //require that chosen winner falls within the defined number of participants for match
//         // require(_betIsValid(msg.sender, _matchId, _chosenWinner));

//         //match must still be open for betting
//         require(_matchOpenForBetting(_matchId)); 

//         //transfer the money into the account 
//         //TODO: why this not work
//         //address(this).transfer(msg.value);
//         uint8 participantCount; 
//         (,,,participantCount,,,) = boxingOracle.getMatch(_matchId);
//         uint totalPool = 0;
//         for (uint8 i = 0; i < participantCount; i++) {
//             totalPool += matchPools[_matchId][i];
//         }
//         uint currentPrice = (totalPool == 0) ? 1 : (matchPools[_matchId][_chosenWinner] * 1e18) / totalPool;
//         uint shares = msg.value * 1e18 / currentPrice;

//         //add the new bet 
//         Bet[] storage bets = matchToBets[_matchId]; 
//         bets.push(Bet(msg.sender, _matchId, msg.value, _chosenWinner)); 

//         //add the mapping
//         bytes32[] storage userBets = userToBets[msg.sender]; 
//         userBets.push(_matchId); 
//         matchPools[_matchId][_chosenWinner] += msg.value;
//     }

//     /// @notice tests that we are connected to a valid oracle for match results 
//     /// @return true if valid connection 
//     function testOracleConnection() public view returns(bool) {
//         return boxingOracle.testConnection();
//     }
// }

contract Bets {
    
    // Struct to keep track of match details
    struct Match {
        uint teamAVolume; // Volume bet on team A
        uint teamBVolume; // Volume bet on team B
        uint totalPool;    // Total pool (team A + team B volume)
    }

    // Mapping to store the volume of bets on each match
    mapping(bytes32 => Match) public matches;
    uint internal minimumBet = 1000000000000;

    // Mapping to store user shares for each match and team
    mapping(bytes32 => mapping(address => uint)) public userSharesA; // Shares for Team A
    mapping(bytes32 => mapping(address => uint)) public userSharesB; // Shares for Team B   

    // Initial volume for both teams at the start of each match
    uint public constant initialVolume = 100 wei; // Use wei/ether for handling large numbers

    /// @notice Creates a new match with initial pools for both teams
    /// @param matchId The ID of the match
    function createMatch(bytes32 matchId) public {
        require(matches[matchId].totalPool == 0, "Match already exists");

        // Set the initial volume for both teams
        matches[matchId].teamAVolume = initialVolume;
        matches[matchId].teamBVolume = initialVolume;
        matches[matchId].totalPool = initialVolume * 2; // Both teams start with initialVolume
    }

    /// @notice Places a bet on a specified team
    /// @param matchId The ID of the match
    /// @param amount The amount bet on the match
    /// @param team A boolean indicating the team to bet on (true for Team A, false for Team B)
    function placeBet(bytes32 matchId, uint32 amount, bool team) public payable {
        require(msg.value > 0, "Must send a valid bet");

        // Retrieve the match
        Match storage matchDetails = matches[matchId];

        // Check that the match exists
        require(matchDetails.totalPool > 0, "Match not found");

        if (team) {
            // Price for Team A
            uint256 currentPrice = matchDetails.teamAVolume / matchDetails.totalPool;
            // Add bet to Team A's volume
            matchDetails.teamAVolume += amount;
            // Update user shares
            uint shares = amount / currentPrice;
            userSharesA[matchId][msg.sender] += shares;
        } else {
            // Price for Team B
            uint256 currentPrice = matchDetails.teamBVolume / matchDetails.totalPool;
            // Add bet to Team B's volume
            matchDetails.teamBVolume += amount;
            // Update user shares
            uint shares = amount / currentPrice;
            userSharesB[matchId][msg.sender] += shares;
        }

        // Update the total pool
        matchDetails.totalPool += amount;
    }

    /// @notice Calculates the current share price for Team A
    /// @param matchId The ID of the match
    /// @return The share price for Team A
    function getTeamAPrice(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return matchDetails.teamAVolume / matchDetails.totalPool; // Price in wei
    }

    /// @notice Calculates the current share price for Team B
    /// @param matchId The ID of the match
    /// @return The share price for Team B
    function getTeamBPrice(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return matchDetails.teamBVolume / matchDetails.totalPool; // Price in wei
    }

    /// @notice Returns the percentage of total volume for Team A
    /// @param matchId The ID of the match
    /// @return Percentage of total pool for Team A
    function getTeamAPercentage(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return (matchDetails.teamAVolume * 100) / matchDetails.totalPool; // Team A percentage
    }

    /// @notice Returns the percentage of total volume for Team B
    /// @param matchId The ID of the match
    /// @return Percentage of total pool for Team B
    function getTeamBPercentage(bytes32 matchId) public view returns (uint) {
        Match storage matchDetails = matches[matchId];
        return (matchDetails.teamBVolume * 100) / matchDetails.totalPool; // Team B percentage
    }

    /// @notice Retrieves the total pool for a match
    /// @param matchId The ID of the match
    /// @return The total pool for the match
    function getTotalPool(bytes32 matchId) public view returns (uint) {
        return matches[matchId].totalPool;
    }

    /// @notice Retrieves the current volume for Team A
    /// @param matchId The ID of the match
    /// @return The volume for Team A
    function getTeamAVolume(bytes32 matchId) public view returns (uint) {
        return matches[matchId].teamAVolume;
    }

    /// @notice Retrieves the current volume for Team B
    /// @param matchId The ID of the match
    /// @return The volume for Team B
    function getTeamBVolume(bytes32 matchId) public view returns (uint) {
        return matches[matchId].teamBVolume;
    }
}