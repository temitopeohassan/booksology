// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract eBookNFT is ERC1155, Ownable, ERC2981 {
    address public admin;
    uint256 public constant SECONDARY_MARKET_FEE = 250; // 2.5% platform fee
    uint256 public constant MAX_LISTING_DURATION = 30 days;
    uint256 public constant MIN_LISTING_DURATION = 1 hours;
    uint256 public minListingPrice;
    uint256 public maxListingPrice;
    
    struct FeeStructure {
        uint256 platformFee; // Base platform fee in basis points (e.g., 250 = 2.5%)
        uint256 volumeDiscount; // Discount for high-volume sellers in basis points
        bool active;
    }
    
    struct eBook {
        string title;
        address author;
        string encryptedContent;
        uint256 supply;
        uint256 price;
    }

    struct SecondaryListing {
        address seller;
        uint256 price;
        uint256 expirationTime;
        bool active;
    }
    
    mapping(uint256 => eBook) private _eBooks;
    mapping(address => mapping(uint256 => bool)) private _userHasAccess;
    mapping(uint256 => mapping(address => SecondaryListing)) private _secondaryListings;
    mapping(address => uint256) private _sellerVolume; // Track seller's total sales volume
    mapping(address => FeeStructure) private _customFeeStructures; // Custom fee structures for specific sellers
    
    event eBookMinted(uint256 indexed tokenId, string title, address author, uint256 supply, uint256 price);
    event eBookPurchased(uint256 indexed tokenId, address buyer);
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event SecondaryListingCreated(uint256 indexed tokenId, address indexed seller, uint256 price, uint256 expirationTime);
    event SecondaryListingCanceled(uint256 indexed tokenId, address indexed seller);
    event SecondaryListingSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event ListingPriceRangeUpdated(uint256 minPrice, uint256 maxPrice);
    event CustomFeeStructureSet(address indexed seller, uint256 platformFee, uint256 volumeDiscount);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not the admin");
        _;
    }
    
    modifier validPrice(uint256 price) {
        require(price >= minListingPrice, "Price too low");
        require(price <= maxListingPrice, "Price too high");
        _;
    }
    
    constructor() ERC1155("") Ownable(msg.sender) {
        admin = 0x2b2542b313385AF7453623765383CE3cc5D3c9cF;
        minListingPrice = 1000000000000000;
        maxListingPrice = 1000000000000000000000;
        _setDefaultRoyalty(admin, 250); // 2.5% default royalty
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    function setAdmin(address newAdmin) public onlyOwner {
        require(newAdmin != address(0), "Invalid admin address");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }
    
    function setListingPriceRange(uint256 _minPrice, uint256 _maxPrice) public onlyAdmin {
        require(_minPrice < _maxPrice, "Invalid price range");
        minListingPrice = _minPrice;
        maxListingPrice = _maxPrice;
        emit ListingPriceRangeUpdated(_minPrice, _maxPrice);
    }

    function setCustomFeeStructure(
        address seller,
        uint256 platformFee,
        uint256 volumeDiscount
    ) public onlyAdmin {
        require(platformFee <= 1000, "Max fee is 10%"); // 1000 basis points = 10%
        require(volumeDiscount <= platformFee, "Discount cannot exceed fee");
        
        _customFeeStructures[seller] = FeeStructure({
            platformFee: platformFee,
            volumeDiscount: volumeDiscount,
            active: true
        });
        
        emit CustomFeeStructureSet(seller, platformFee, volumeDiscount);
    }
    
    function mintEBook(
        string memory title,
        string memory uri,
        uint256 supply,
        uint256 price,
        uint256 tokenId
    ) public onlyAdmin {
        _mint(admin, tokenId, supply, "");
        _setURI(uri);
        _eBooks[tokenId] = eBook(title, admin, "", supply, price);
        emit eBookMinted(tokenId, title, admin, supply, price);
    }
    
    function calculateFees(address seller, uint256 price) public view returns (
        uint256 platformFee,
        uint256 royaltyAmount,
        uint256 sellerAmount
    ) {
        // Get custom fee structure if it exists
        FeeStructure memory feeStructure = _customFeeStructures[seller];
        uint256 effectivePlatformFee = feeStructure.active ? feeStructure.platformFee : SECONDARY_MARKET_FEE;
        
        // Apply volume discount if applicable
        if (feeStructure.active && _sellerVolume[seller] > 10 ether) {
            effectivePlatformFee = effectivePlatformFee - feeStructure.volumeDiscount;
        }
        
        platformFee = (price * effectivePlatformFee) / 10000;
        (,royaltyAmount) = royaltyInfo(0, price);
        sellerAmount = price - platformFee - royaltyAmount;
        
        return (platformFee, royaltyAmount, sellerAmount);
    }
    
    function buyEBook(uint256 tokenId) public payable {
        eBook storage book = _eBooks[tokenId];
        require(msg.value >= book.price, "Insufficient payment");
        require(balanceOf(address(this), tokenId) > 0, "No more copies available");
        
        _safeTransferFrom(address(this), msg.sender, tokenId, 1, "");
        _userHasAccess[msg.sender][tokenId] = true;
        
        // Handle royalties for primary sale
        (address royaltyReceiver, uint256 royaltyAmount) = royaltyInfo(tokenId, msg.value);
        payable(royaltyReceiver).transfer(royaltyAmount);
        
        // Transfer remaining amount to the admin
        payable(admin).transfer(msg.value - royaltyAmount);
        
        emit eBookPurchased(tokenId, msg.sender);
    }

    function listBookForSale(
        uint256 tokenId,
        uint256 price,
        uint256 duration
    ) public validPrice(price) {
        require(balanceOf(msg.sender, tokenId) > 0, "You don't own this book");
        require(duration >= MIN_LISTING_DURATION && duration <= MAX_LISTING_DURATION, "Invalid duration");
        
        uint256 expirationTime = block.timestamp + duration;
        
        _secondaryListings[tokenId][msg.sender] = SecondaryListing({
            seller: msg.sender,
            price: price,
            expirationTime: expirationTime,
            active: true
        });
        
        emit SecondaryListingCreated(tokenId, msg.sender, price, expirationTime);
    }

    function batchListBooksForSale(
        uint256[] calldata tokenIds,
        uint256[] calldata prices,
        uint256[] calldata durations
    ) public {
        require(
            tokenIds.length == prices.length && prices.length == durations.length,
            "Array lengths must match"
        );
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            listBookForSale(tokenIds[i], prices[i], durations[i]);
        }
    }

    function cancelListing(uint256 tokenId) public {
        require(_secondaryListings[tokenId][msg.sender].active, "No active listing found");
        require(_secondaryListings[tokenId][msg.sender].seller == msg.sender, "Not your listing");
        
        delete _secondaryListings[tokenId][msg.sender];
        emit SecondaryListingCanceled(tokenId, msg.sender);
    }

    function batchCancelListings(uint256[] calldata tokenIds) public {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (_secondaryListings[tokenIds[i]][msg.sender].active &&
                _secondaryListings[tokenIds[i]][msg.sender].seller == msg.sender) {
                cancelListing(tokenIds[i]);
            }
        }
    }

    function buySecondaryBook(uint256 tokenId, address seller) public payable {
        SecondaryListing storage listing = _secondaryListings[tokenId][seller];
        require(listing.active, "Listing is not active");
        require(block.timestamp < listing.expirationTime, "Listing has expired");
        require(msg.value >= listing.price, "Insufficient payment");
        require(balanceOf(seller, tokenId) > 0, "Seller no longer owns the book");
        
        // Calculate fees
        (uint256 platformFee, uint256 royaltyAmount, uint256 sellerAmount) = calculateFees(seller, msg.value);
        
        // Transfer the token
        _safeTransferFrom(seller, msg.sender, tokenId, 1, "");
        _userHasAccess[msg.sender][tokenId] = true;
        
        // Update seller's volume
        _sellerVolume[seller] += msg.value;
        
        // Distribute payments
        payable(admin).transfer(platformFee);
        (address royaltyReceiver,) = royaltyInfo(tokenId, msg.value);
        payable(royaltyReceiver).transfer(royaltyAmount);
        payable(seller).transfer(sellerAmount);
        
        // Clean up the listing
        delete _secondaryListings[tokenId][seller];
        
        emit SecondaryListingSold(tokenId, seller, msg.sender, msg.value);
    }

    function getSecondaryListing(uint256 tokenId, address seller) public view returns (
        address listingSeller,
        uint256 price,
        uint256 expirationTime,
        bool active
    ) {
        SecondaryListing memory listing = _secondaryListings[tokenId][seller];
        return (listing.seller, listing.price, listing.expirationTime, listing.active);
    }

    function getEBookMetadata(uint256 tokenId) public view returns (
        string memory title,
        address author,
        uint256 supply,
        uint256 price
    ) {
        eBook memory book = _eBooks[tokenId];
        return (book.title, book.author, book.supply, book.price);
    }
    
    function getEncryptedContent(uint256 tokenId) public view returns (string memory) {
        require(_userHasAccess[msg.sender][tokenId], "You don't have access to this eBook");
        return _eBooks[tokenId].encryptedContent;
    }
    
    function setEncryptedContent(uint256 tokenId, string memory content) public onlyAdmin {
        _eBooks[tokenId].encryptedContent = content;
    }
    
    function setRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) public onlyAdmin {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    function getSellerVolume(address seller) public view returns (uint256) {
        return _sellerVolume[seller];
    }

    function getCustomFeeStructure(address seller) public view returns (
        uint256 platformFee,
        uint256 volumeDiscount,
        bool active
    ) {
        FeeStructure memory feeStructure = _customFeeStructures[seller];
        return (feeStructure.platformFee, feeStructure.volumeDiscount, feeStructure.active);
    }
    
    function withdraw() public onlyAdmin {
        uint256 balance = address(this).balance;
        payable(admin).transfer(balance);
    }
}
