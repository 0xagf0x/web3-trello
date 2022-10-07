// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.17;

contract Manager {
    address payable public owner;

    constructor() {
        owner =  payable(msg.sender);
    }

    modifier onlyOwner {
         require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    struct Ticket {
        uint8 status;
        string name;
        // string desc;
    }

    // we have a list of Tickets and they're an array named "tickets"
    Ticket[] public tickets; 

    function createTicket(string memory _name) public {
        // push to the Ticket array
        tickets.push(Ticket(0, _name));
    }

    // find the index and update the name
    function updateTicketName(uint _index, string memory _newName) external {
        tickets[_index].name = _newName;
    }

    // find the index and update the status
    function updateTicketStatus(uint _index, uint8 _newStatus) external {
        tickets[_index].status = _newStatus;
    }

    function getAllTickets() external view returns(Ticket[] memory) {
        return tickets;
    }

    // function deleteTicket(uint _index) external {
    //     delete tickets[_index];
    // }

    function destroyContract() public onlyOwner {
        selfdestruct(owner);
    }
}