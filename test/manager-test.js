const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Manager contract", function() {
    let Manager, manager, tickets;

    before(async function() {
        Manager = await ethers.getContractFactory('Manager');
        manager = await Manager.deploy();
        await manager.deployed();
    });


    it("Should create a new ticket", async function () {
        await manager.createTicket("Charlie");
        tickets = await manager.getAllTickets();
        console.log("All Tickets:", tickets)
        expect(tickets[0].name).to.equal("Charlie");
    });


    it("Should update the ticket name", async function () {
        await manager.updateTicketName(0, "New Charlie");
        tickets = await manager.getAllTickets();
        expect(tickets[0].name).to.equal("New Charlie");
    });

    it("Should update the ticket status", async function () {
        await manager.updateTicketStatus(0, 2);
        tickets = await manager.getAllTickets();
        expect(tickets[0].status).to.equal(2);
    });


    it("Should return a list of tickets", async function () {
        await manager.createTicket('My New Ticket');
        await manager.createTicket('My New Ticket');
        await manager.createTicket('My New Ticket');
        tickets = await manager.getAllTickets();
        console.log('tickets.length', tickets.length);
        expect(tickets.length).to.equal(4);
    });

});