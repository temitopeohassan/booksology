// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/IdentityNFT.sol";

contract IdentityNFTTest is Test {
    IdentityNFT public nft;

    function setUp() public {
        nft = new IdentityNFT(address(this));
    }

    function testMint() public {
        nft.mint(address(this));
        assertEq(nft.balanceOf(address(this)), 1);
        assertEq(nft.totalSupply(), 1);
    }

    // Add more tests as needed
}
