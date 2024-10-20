// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.24;

// contract Oracle {

//     enum MatchOutcome {
//         Pending,    //match has not been fought to decision
//         Underway,   //match has started & is underway
//         Draw,       //anything other than a clear winner (e.g. cancelled)
//         Decided     //index of participant who is the winner 
//     }

//     function getPendingMatches() public view virtual returns (bytes32[] memory);

//     function getAllMatches() public view virtual returns (bytes32[] memory);

//     function matchExists(bytes32 _matchId) public view virtual returns (bool); 

//     function getMatch(bytes32 _matchId) public view virtual returns (
//         bytes32 id,
//         string memory name, 
//         string memory participants,
//         uint8 participantCount,
//         uint date, 
//         MatchOutcome outcome, 
//         int8 winner);

//     function getMostRecentMatch(bool _pending) public view virtual returns (
//         bytes32 id,
//         string memory name, 
//         string memory participants,
//         uint8 participantCount,
//         uint date, 
//         MatchOutcome outcome, 
//         int8 winner);

//     function testConnection() public pure virtual returns (bool);

//     function addTestData() public virtual; 
// }
