// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GameRewards {
    struct PlayerScore {
        address player;
        uint256 score;
        uint256 timestamp;
    }

    mapping(address => uint256) public playerBalances;
    PlayerScore[] public leaderboard;
    uint256 public constant MIN_DEPOSIT = 0.01 ether;
    uint256 public constant REWARD_THRESHOLD = 1000;

    event ScoreSubmitted(address indexed player, uint256 score, uint256 timestamp);
    event RewardClaimed(address indexed player, uint256 amount);
    event DepositMade(address indexed player, uint256 amount);

    function deposit() external payable {
        require(msg.value >= MIN_DEPOSIT, "Minimum deposit not met");
        playerBalances[msg.sender] += msg.value;
        emit DepositMade(msg.sender, msg.value);
    }

    function submitScore(uint256 _score) external {
        require(playerBalances[msg.sender] > 0, "Must have active deposit");
        
        leaderboard.push(PlayerScore({
            player: msg.sender,
            score: _score,
            timestamp: block.timestamp
        }));

        if (_score >= REWARD_THRESHOLD) {
            uint256 reward = calculateReward(_score);
            if (reward > 0 && reward <= address(this).balance) {
                payable(msg.sender).transfer(reward);
                emit RewardClaimed(msg.sender, reward);
            }
        }

        emit ScoreSubmitted(msg.sender, _score, block.timestamp);
    }

    function getTopScores(uint256 limit) external view returns (PlayerScore[] memory) {
        uint256 resultSize = limit < leaderboard.length ? limit : leaderboard.length;
        PlayerScore[] memory topScores = new PlayerScore[](resultSize);
        
        for (uint256 i = 0; i < resultSize; i++) {
            topScores[i] = leaderboard[i];
        }
        
        return topScores;
    }

    function calculateReward(uint256 _score) internal pure returns (uint256) {
        return (_score / REWARD_THRESHOLD) * 0.001 ether;
    }

    function getBalance() external view returns (uint256) {
        return playerBalances[msg.sender];
    }
}