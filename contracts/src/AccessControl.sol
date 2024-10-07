// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IIdentityNFT {
    function balanceOf(address owner) external view returns (uint256);
}

interface IEBookNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getEBookMetadata(uint256 tokenId) external view returns (string memory, address);
}

contract AccessControl is Ownable {
    IIdentityNFT public identityNFT;
    IEBookNFT public eBookNFT;

    event AccessGranted(address indexed user, uint256 eBookId, string eBookTitle);
    event AccessDenied(address indexed user, uint256 eBookId, string reason);

    constructor(address _identityNFTAddress, address _eBookNFTAddress) Ownable(msg.sender) {
        identityNFT = IIdentityNFT(_identityNFTAddress);
        eBookNFT = IEBookNFT(_eBookNFTAddress);
    }

    function verifyAccess(address user, uint256 eBookId) public returns (bool) {
        // Check if the user has an Identity NFT
        if (identityNFT.balanceOf(user) == 0) {
            emit AccessDenied(user, eBookId, "User does not have an Identity NFT");
            return false;
        }

        // Check if the user owns the eBook NFT
        if (eBookNFT.ownerOf(eBookId) != user) {
            emit AccessDenied(user, eBookId, "User does not own the eBook NFT");
            return false;
        }

        // If both checks pass, grant access
        (string memory eBookTitle,) = eBookNFT.getEBookMetadata(eBookId);
        emit AccessGranted(user, eBookId, eBookTitle);
        return true;
    }

    function requestAccess(uint256 eBookId) public returns (bool) {
        return verifyAccess(msg.sender, eBookId);
    }

    function setIdentityNFTAddress(address _newAddress) public onlyOwner {
        identityNFT = IIdentityNFT(_newAddress);
    }

    function setEBookNFTAddress(address _newAddress) public onlyOwner {
        eBookNFT = IEBookNFT(_newAddress);
    }
}