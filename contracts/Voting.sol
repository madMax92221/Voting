// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IVoting.sol";

contract Voting is IVoting {
    Parties public winner;

    address public owner;

    uint private constant DURATION = 360 seconds;
    uint public startAt;
    uint public endAt;

    mapping(uint => uint) partycount;
    mapping(address => bool) private voted;

    constructor() {
        startAt = block.timestamp;
        endAt = block.timestamp + DURATION;
        owner = msg.sender;
    }

    modifier cantVoteTwice() {
        require(voted[msg.sender] == false, "You cannot vote twice");
        _;
    }

    function vote(Parties _party) external override cantVoteTwice {
        require(endAt > block.timestamp, "Voting has finished");
        voted[msg.sender] = true;
        if (_party == Parties.A) {
            partycount[uint(Parties.A)] += 1;
            emit VotedforA();
        } else if (_party == Parties.B) {
            partycount[uint(Parties.B)] += 1;
            emit VotedforB();
        } else if (_party == Parties.C) {
            partycount[uint(Parties.C)] += 1;
            emit VotedforC();
        }
    }

    function getWinner() external override returns (Parties) {
        require(block.timestamp > endAt, "Voting hasn't finished yet");

        if (
            partycount[uint(Parties.A)] > partycount[uint(Parties.B)] &&
            partycount[uint(Parties.A)] > partycount[uint(Parties.C)]
        ) {
            winner = Parties.A;
        } else if (
            partycount[uint(Parties.B)] > partycount[uint(Parties.A)] &&
            partycount[uint(Parties.B)] > partycount[uint(Parties.C)]
        ) {
            winner = Parties.B;
        } else {
            winner = Parties.C;
        }

        emit Winner();

        return winner;
    }
}
