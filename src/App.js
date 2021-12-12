import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";



const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--hotpink);
  padding: 10px;
  font-weight: bold;
  color: var(--accent-text);
  width: 120px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: column;
  justify-content: stretched;
  // align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
    justify-content: center;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
  word-break: break-all;
  white-space: break-spaces;
`;


function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [Voting, setVoting] = useState(false);
  const [Closing, setClosing] = useState(false);
  const [Withdrawing, setwithdraw] = useState(false);
  const [feedback, setFeedback] = useState(`Playing with puppy...`);
  const [feedback2, setFeedback2] = useState('');
  const dateTime = Date.now();
  const timestamp = Math.floor(dateTime / 1000);



  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const ApproveSBP = () => {
    setFeedback(`Approving $SBP to vote...`);
    blockchain.smartContract.methods
      .approveMax(CONFIG.CONTRACT_ADDRESS)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Your tokens are approved.`
        );
        dispatch(fetchData(blockchain.account));
      });
  };  


  const voteACCEPT = () => {
    setFeedback(`Voting...`);
    setVoting(true);
    blockchain.smartContract.methods
      .VoteAccept(VoteAmount)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setVoting(false);
        setFeedback2("Did you cancel transaction? Or check the vote is running etc");
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Your vote succesfully confirmed.`
        );
        setVoting(false);
        setFeedback2('');
        dispatch(fetchData(blockchain.account));
      });
  };  

  const voteREJECT = () => {
    setFeedback(`Voting...`);
    setVoting(true);
    blockchain.smartContract.methods
      .VoteReject(VoteAmount)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setFeedback2("Did you cancel transaction? Or check the vote is running etc");
        setVoting(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Your vote succesfully confirmed.`);
          setFeedback2('');
        setVoting(false);
        dispatch(fetchData(blockchain.account));
      });
  };  

  const withdrawVotes = () => {
    setFeedback(`Withdrawing...`);
    setwithdraw(true);
    blockchain.smartContract.methods
      .ClaimVotetokens()
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setFeedback2("Did you cancel transaction? Or check the vote is settled etc");
        setwithdraw(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Your withdrawal is successful.`
        );
        setwithdraw(false);
        dispatch(fetchData(blockchain.account));
      });
  };  

  const voteCLOSE = () => {
    setFeedback(`Withdrawing...`);
    setClosing(true);
    blockchain.smartContract.methods
      .closevote()
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClosing(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Vote is Settled.`
        );
        setClosing(false);
        dispatch(fetchData(blockchain.account));
      });
  };  



  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };


const [Balance, setBalance] = useState(0);
const [voteDesc, setDesc] = useState('none');
const [votedToken, setVTK] = useState(0);
const [TotalVote, setTV] = useState(0);
const [TotalAccept, setTA] = useState(0);
const [TotalReject, setTR] = useState(0);
const [VoteRunning, setVR] = useState();
const [VoteStart, setvsb] = useState(0);
const [VoteEnd, setveb] = useState(0);

const [VoteResult, setvrt] = useState('none');
const [dateS, setdateS] = useState('none');
const [dateE, setdateE] = useState('none');

const [VoteAmount, setInput] = useState(0);
const [Allowance, setAllow] = useState(0);

useEffect(async ()=>{

if (blockchain.account !== "" && blockchain.smartContract !== null) {
  const bal = await getBalance();
  setBalance(bal/10**18);
}
else
setBalance("Connect Wallet Please")
})
const getBalance = async () => {
    return await blockchain.smartContract.methods.balanceOf(blockchain.account).call();
};

useEffect(async ()=>{
  if (blockchain.account !== "" && blockchain.smartContract !== null){
  const Desc = await blockchain.smartContract.methods.voteDescription().call();
  setDesc(Desc);}
  else{
  setDesc("Connect WalletPlease")
  }
})

useEffect(async ()=>{
  if (blockchain.account !== "" && blockchain.smartContract !== null){
  const Allow = await blockchain.smartContract.methods.allowance(blockchain.account, CONFIG.CONTRACT_ADDRESS).call();
  setAllow(Allow);
  }
  else{
  setAllow(0);
  }
})

useEffect(async ()=>{
  if (blockchain.account !== "" && blockchain.smartContract !== null){
  const VTK = await blockchain.smartContract.methods.YourUnclaimedVotes(blockchain.account).call();
  setVTK(VTK);}
  else{
  setVTK("Connect WalletPlease")
  }
})

useEffect(async ()=>{
  if (blockchain.account !== "" && blockchain.smartContract !== null){
  const TV = await blockchain.smartContract.methods.TotalVotes().call();
  setTV(TV);}
  else{
  setTV("Connect WalletPlease")
  }
})

useEffect(async ()=>{
  if (blockchain.account !== "" && blockchain.smartContract !== null){
  const TA = await blockchain.smartContract.methods.voteAccepts().call();
  setTA(TA);}
  else{
  setTA("Connect WalletPlease")
  }
})

useEffect(async ()=>{
  if (blockchain.account !== "" && blockchain.smartContract !== null){
  const TR = await blockchain.smartContract.methods.voteRejects().call();
  setTR(TR);}
  else{
  setTR("Connect WalletPlease")
  }
})

useEffect(async ()=>{
  if (blockchain.account !== "" && blockchain.smartContract !== null){
    const sb = await blockchain.smartContract.methods.votestartblock().call();
    const eb = await blockchain.smartContract.methods.voteendblock().call();
    if (sb<timestamp && timestamp<eb){
      setVR ("true")
      }
      else{
        setVR ("false")
      }
    }
  else{
  setVR("Connect WalletPlease")
  }
})

useEffect(async ()=>{
  if (blockchain.account !== "" && blockchain.smartContract !== null){
  const vrt = await blockchain.smartContract.methods.voteresults().call();
  setvrt(vrt);}
  else{
  setvrt("Connect WalletPlease")
  }
})

useEffect(async ()=>{
  if (blockchain.account !== "" && blockchain.smartContract !== null){
  const vsb = await blockchain.smartContract.methods.votestartblock().call();
  setvsb(vsb);
  let sdate = new Date(vsb*1000);
  let dateSt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(sdate)
  setdateS(dateSt);
}
  else{
  setvsb("Connect WalletPlease")
  }
})

useEffect(async ()=>{
  if (blockchain.account !== "" && blockchain.smartContract !== null){
  const veb = await blockchain.smartContract.methods.voteendblock().call();
  setveb(veb);
  let edate = new Date(veb*1000);
  let dateEn = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(edate)
  setdateE(dateEn);
}
  else{
  setveb("Connect WalletPlease")
  }
})

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>      
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--yellow)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        <s.SpacerMedium />
        <ResponsiveWrapper>
        <StyledLink style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "var(--primary)",
              }}
              target={"_self"} href={'https://shibapad.finance'}>
              MainPage
              </StyledLink> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <StyledLink style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "var(--primary)",
              }}
              target={"_self"} href={'https://dash.shibapad.finance/'}>
              Dashboard
              </StyledLink>
              </ResponsiveWrapper>

        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>

          <s.Container
            flex={2}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 20,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
          <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 15,
                fontWeight: "bold",
                color: "var(--primary)",
              }}
            >           
            {feedback}
            <s.SpacerSmall></s.SpacerSmall>
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--secondary-text)",
              }}
            >
              Contract address :&nbsp;
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                 {truncate(CONFIG.CONTRACT_ADDRESS)}
              </StyledLink>
            </s.TextDescription>

            <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >

                Wallet : {blockchain.account}
                    </s.TextDescription>
                    <s.SpacerSmall />
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >           
              Your $SBP : {Balance}
            </s.TextTitle>


            {Number(Balance) < 1 ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You have no more vote Power.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can buy {CONFIG.token_NAME} on Pancakeswap.
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ):(<s.TextTitle
              style={{ textAlign: "center", color: "var(--accent-text)" }}
            >
              1 $SBP = 1 Vote
            </s.TextTitle>)}

              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Note : You can't withdraw your tokens before vote ends
                </s.TextTitle>
                <s.SpacerMedium />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                               <s.SpacerSmall />
                    <s.Container
            flex={1}

            ai={"center"} jc={"center"}
            style={{
              flex: 1,
              backgroundColor: "var(--primary)",
              marginLeft: 40,
              marginRight: 40,
              padding: 60,
              borderRadius: 24,
              border: "4px dashed var(--primary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              maxWidth : 500,
            }}>


                        <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            Vote Description : {voteDesc}
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            Is vote running? : {VoteRunning}
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            Starts : &nbsp;{dateS}
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: "var(--secondary)",
              }}
            >  
          (TimeStamp : {VoteStart})
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
          Ends : &nbsp;{dateE}
          </s.TextTitle>
          <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "var(--secondary)",
              }}
            >  
          (TimeStamp : {VoteEnd})
            </s.TextTitle>
            <s.SpacerLarge/>

            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}>
            Vote amount</s.TextTitle> 
            <input type="text" onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
        
      }} value ={VoteAmount} onInput={e => setInput(e.target.value)
      }
        
     
            style={{ padding:5, borderRadius: 24,
              border: "4px dashed var(--accent)",
              textAlign: "center",
                fontSize: 20, color: "var(--accent)", width: "300px"}}/>
<s.SpacerSmall/>
<s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 20,
                color: "var(--accent-text)",
              }}>
                {feedback2}
                </s.TextTitle>
            <s.Container
            flex={1}
            ai={"center"} jc={"center"} fd={"row"}
            style={{
              backgroundColor: "var(--primary)",
              padding: 5,
              borderRadius: 24,
              border: "",
            }}
            >
                      <StyledButton
                        disabled={Voting ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          voteACCEPT();
                          getData();
                        }}
                      >
                        {Voting ? "BUSY" : "VOTE ACCEPT"}
                      </StyledButton>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                      <StyledButton
                        disabled={Voting ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          voteREJECT();
                          getData();
                        }}
                      >
                        {Voting ? "BUSY" : "VOTE REJECT"}
                      </StyledButton>
                      </s.Container>
                      <s.SpacerSmall/>
                      <StyledButton
                        hidden={Allowance>0 ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          ApproveSBP();
                          getData();
                        }}
                      >
                      
                        {Allowance>0 ? "Approved" : "Approve"}
                      </StyledButton>
                      <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
                      {Allowance > 0?
            "your $SBP tokens are Approved"
            : "Approve $SBP before Vote / Withdrawl"}
            </s.TextTitle>
                      <s.SpacerMedium/>
                      <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            Your voted tokens : {votedToken}
            </s.TextTitle>
            <s.SpacerSmall/>
            <StyledButton
                        disabled={Withdrawing ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          withdrawVotes();
                          getData();
                        }}
                      >
                        {Withdrawing ? "BUSY" : "Withdraw All Votes"}
                      </StyledButton>

                    </s.Container>
                        <s.SpacerLarge/>
                        
                        <s.SpacerLarge/>
                    <s.Container
            flex={1}

            ai={"center"} jc={"center"}
            style={{
              flex: 1,
              backgroundColor: "var(--primary)",
              marginLeft: 40,
              marginRight: 40,
              padding: 60,
              borderRadius: 24,
              border: "4px dashed var(--primary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              maxWidth: 500,
            }}>
                        <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            Total votes : {TotalVote}
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            Total Accepts : {TotalAccept}
            </s.TextTitle>

            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            Total Rejects : {TotalReject}
            </s.TextTitle>

            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            threshold to settle :
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            {200000000} votes
            </s.TextTitle>

            <s.SpacerXSmall/>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            is Vote Running? : {VoteRunning}
            </s.TextTitle>

            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >    
            VoteResult : {VoteResult}
            </s.TextTitle>
            <s.SpacerMedium/>
            <StyledButton
                        disabled={Closing ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          voteCLOSE();
                          getData();
                        }}
                      >
                        {Closing ? "BUSY" : "Settle Vote"}
                      </StyledButton>
            </s.Container>


                  </>
                )}
              </>

            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />

        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet).
            Note : Once you settle your vote, you can't withdraw it before the voting has ended.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
