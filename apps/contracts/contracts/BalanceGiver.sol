interface IERC20 {
    function faucet(address _to) external ;
    function transfer(address _to, uint256 amount) external;
}
contract BalanceGiver {

    address[5] public supportedTokens;

    constructor(address[5] memory tokensAddr) {

        for(uint256 i=0;i<5;i++){
            supportedTokens[i] = tokensAddr[i];
        }
    }

    function generateBalances() external {
        for(uint256 i=0;i<5;i++){
            _generateBalances(supportedTokens[i],msg.sender);
        }
    }
    function _generateBalances(address token, address user) internal {
        IERC20(token).faucet(address(this));
        IERC20(token).transfer(user,5e10);
    }
}