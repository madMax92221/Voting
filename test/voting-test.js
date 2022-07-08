const { expect } = require("chai");
const { ethers } = require("hardhat");

let owner;
let voting;
let addr1;
let addr2;
let addr3;
let addr4;
let addr5;
let addr6;
let addr7;

describe("Voting contract", async function () {
  //before running every It test it will deploy the token
  beforeEach(async function () {
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    voting.deployed();

    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7] =
      await ethers.getSigners();
  });

  it("Should successfully deploy", async function () {
    console.log("success");
  });

  it("Should set the right owner", async function () {
    expect(await voting.owner()).to.equal(owner.address);
  });

  it("Should increase counts for Party A with 1", async function () {
    await voting.voteA();
    const counter1 = voting.counter1;
    expect(await voting.counter1()).to.equal(1);
  });

  it("Should increase counts for Party B with 1", async function () {
    await voting.voteB();
    const counter2 = voting.counter2;
    expect(await voting.counter2()).to.equal(1);
  });

  it("Should increase counts for Party C with 1", async function () {
    await voting.voteC();
    const counter3 = voting.counter3;
    expect(await voting.counter3()).to.equal(1);
  });

  it("Should pick partyA if it has the most votes", async function () {
    await voting.connect(owner).voteA();
    await voting.connect(addr1).voteA();
    await voting.connect(addr2).voteA();
    await voting.connect(addr3).voteB();
    await voting.connect(addr4).voteB();
    await voting.connect(addr5).voteC();
    const winner = voting.winner;
    await ethers.provider.send("evm_increaseTime", [370]);
    await ethers.provider.send("evm_mine", []);
    expect((await voting.getWinner()).value).to.equal("0");
  });

  it("Should pick partyB if it has the most votes", async function () {
    await voting.connect(owner).voteA();
    await voting.connect(addr1).voteA();
    await voting.connect(addr2).voteB();
    await voting.connect(addr3).voteB();
    await voting.connect(addr4).voteB();
    await voting.connect(addr5).voteC();
    const winner = voting.winner;
    await ethers.provider.send("evm_increaseTime", [370]);
    await ethers.provider.send("evm_mine", []);
    expect((await voting.gtWinner()).value).to.equal("1");
  });

  it("Should pick partyC if it has the most votes", async function () {
    await voting.connect(owner).voteA();
    await voting.connect(addr1).voteA();
    await voting.connect(addr2).voteB();
    await voting.connect(addr3).voteC();
    await voting.connect(addr4).voteC();
    await voting.connect(addr5).voteC();
    const winner = voting.winner;
    await ethers.provider.send("evm_increaseTime", [370]);
    await ethers.provider.send("evm_mine", []);
    expect((await voting.getWinner()).value).to.equal("2");
  });

  it("Should revert if voting has finished", async function () {
    await ethers.provider.send("evm_increaseTime", [370]);
    await ethers.provider.send("evm_mine", []);
    await expect(voting.connect(addr7).voteA()).to.be.revertedWith(
      "Voting has finished"
    );
  });

  it("Should revert if you have votted twice from the same address", async function () {
    await voting.voteA();
    await expect(voting.voteA()).to.be.revertedWith("You cannot vote twice");
  });

  it("Should revert if voting is hasn't finished", async function () {
    await ethers.provider.send("evm_increaseTime", [300]);
    await ethers.provider.send("evm_mine", []);
    await expect(voting.getWinner()).to.be.revertedWith(
      "Voting hasn't finished yet"
    );
  });
});
