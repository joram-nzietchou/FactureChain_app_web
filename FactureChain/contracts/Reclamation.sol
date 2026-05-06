// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReclamationSystem {
    
    struct MeterReading {
        uint256 id;
        address owner;
        string subscriberNumber;
        uint256 previousIndex;
        uint256 currentIndex;
        uint256 timestamp;
    }

    mapping(uint256 => MeterReading) public meterReadings;
    mapping(string => uint256[]) public subscriberReadings;
    
    uint256 public nextReadingId;

    event ReadingStored(
        uint256 id,
        address indexed owner,
        string subscriberNumber,
        uint256 previousIndex,
        uint256 currentIndex,
        uint256 timestamp
    );

    // Fonction simplifiée : enregistre uniquement l'index
    function storeReading(
        string memory _subscriberNumber,
        uint256 _previousIndex,
        uint256 _currentIndex
    ) public {
        require(_currentIndex > _previousIndex, "L'index actuel doit etre superieur");
        
        uint256 id = nextReadingId;
        
        meterReadings[id] = MeterReading({
            id: id,
            owner: msg.sender,
            subscriberNumber: _subscriberNumber,
            previousIndex: _previousIndex,
            currentIndex: _currentIndex,
            timestamp: block.timestamp
        });
        
        subscriberReadings[_subscriberNumber].push(id);
        
        emit ReadingStored(id, msg.sender, _subscriberNumber, _previousIndex, _currentIndex, block.timestamp);
        
        nextReadingId++;
    }

    // Récupérer tous les IDs d'un abonné
    function getSubscriberReadingIds(string memory _subscriberNumber) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return subscriberReadings[_subscriberNumber];
    }

    // Récupérer un relevé par ID
    function getReading(uint256 _id) 
        public 
        view 
        returns (
            uint256 id,
            address owner,
            string memory subscriberNumber,
            uint256 previousIndex,
            uint256 currentIndex,
            uint256 timestamp
        ) 
    {
        MeterReading memory reading = meterReadings[_id];
        return (
            reading.id,
            reading.owner,
            reading.subscriberNumber,
            reading.previousIndex,
            reading.currentIndex,
            reading.timestamp
        );
    }
}