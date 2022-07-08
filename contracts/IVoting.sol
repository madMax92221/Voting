// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IVoting {

     /// Enum that contains the three parties
    enum Parties { 
        A, B, C 
        }

    /// Event triggered when voters vote for party A
    event VotedforA ();

    /// Event triggered when voters vote for party B
    event VotedforB ();

    /// Event triggered when voters vote for party C
    event VotedforC ();

    /// Event triggered when the winner is announced
    event Winner();

     
    /// Vote for a party
    /// @param _party to vote for a specific party
    function vote(Parties _party) external;

    /// Gets the winner with the most votes
    function getWinner() external returns(Parties);
}