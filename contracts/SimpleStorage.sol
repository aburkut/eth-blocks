// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract SimpleStorage {
    address owner;
    struct DayData {
        uint blocksNumber;
        string ethSpent;
    }

    mapping(string => DayData) public dayMapping;
    string[] public daysArr;

    constructor() {
        owner = msg.sender;
    }

    modifier _ownerOnly(){
        require(msg.sender == owner);
        _;
    }

    function setDay(string memory key, uint _blocksNumber, string memory _ethSpent) _ownerOnly public {
        DayData memory dayItem;

        dayItem.blocksNumber = _blocksNumber;
        dayItem.ethSpent = _ethSpent;

        dayMapping[key] = dayItem;

        daysArr.push(key);
    }

    function getDays() view public returns (string[] memory) {
        return daysArr;
    }
}
