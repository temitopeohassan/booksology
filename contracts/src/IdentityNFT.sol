// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityNFT is ERC721, Ownable {
    uint256 private _currentTokenId;
    mapping(address => bool) private _hasMinted;

    event IdentityNFTMinted(address indexed user, uint256 tokenId);

    constructor() ERC721("IdentityNFT", "IDNFT") Ownable(msg.sender) {}

    function mintIdentityNFT() public {
        require(!_hasMinted[msg.sender], "User has already minted an Identity NFT");

        unchecked {
            _currentTokenId++;
        }
        
        _safeMint(msg.sender, _currentTokenId);
        _hasMinted[msg.sender] = true;

        emit IdentityNFTMinted(msg.sender, _currentTokenId);
    }

    function hasMinted(address user) public view returns (bool) {
        return _hasMinted[user];
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can burn the Identity NFT");
        _hasMinted[msg.sender] = false;
        _burn(tokenId);
    }
}