import {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import Manager from './artifacts/contracts/Manager.sol/Manager.json';
import './scss/main.scss';
import titleImg from './assets/trello.gif';
import loadingGif from './assets/loading.gif';
import twitterLogo from './assets/twitter.png';


function App() {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [tickets, setTickets] = useState([]);
  const[isLoading, setIsLoading] = useState(false);

  const getTickets = async() => {
    const result = await contract.getAllTickets();
    const titles = document.querySelectorAll('.card-title');
    titles.forEach(title => {
        if (title.textContent === '') {
          // title.parentElement.parentElement.classList.add('d-none');
          title.parentElement.parentElement.remove();
        }
    });
    setTickets(result);
  }

  const createNewTicket = async(_name) => {
    setIsLoading(true)
    const result = await contract.createTicket(_name);
    await result.wait();
    console.log(result)
    setName(result)
    setIsLoading(false)
  }

  const updateTicketStatus = async(_index, _status) => {
    const result = await contract.updateTicketStatus(_index, _status);
    await result.wait();
    getTickets();
  }

  const renameTicket = async(_index) => {
    let newName = prompt("Please enter a new ticket name", " ")
    const result = await contract.updateTicketName(_index, newName);
    await result.wait();
    getTickets();
  }

  const removeTicket = async(_index) => {
    setIsLoading(true);
    console.log('delete', _index)
    console.log('contract', contract)
    const result = await contract.deleteTicket(_index);
    await result.wait();
    getTickets();
    const titles = document.querySelectorAll('.card-title');
    titles.forEach(title => {
        if (title.textContent === '') {
          // title.parentElement.parentElement.classList.add('d-none');
          title.parentElement.parentElement.remove();
        }
    });
    setIsLoading(false);
  }



  const initConnection = async() => {
    // instantiates new contract and gets account
    // check if browser has MetaMask
    if (typeof window.ethereum !== "undefined") {
      // pop up MetaMask
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setAccount(accounts[0]);
      setContract(
        new ethers.Contract(
          '0x3E2C9BC6Fa3740B7DDFed2c4cA7056c897810460',
          Manager.abi,
          signer
        )
      );
    } else {
      console.log('Please install MetaMask.')
    }
  }

  useEffect(() => {
     const titles = document.querySelectorAll('.card-title');
      titles.forEach(title => {
          if (title.textContent === '') {
            // title.parentElement.parentElement.classList.add('d-none');
            title.parentElement.parentElement.remove();
          }
      });
    initConnection();
  }, [])

  console.log('contract', contract)


  return (
    <div className='page'>

      <div className='header'>
        <div className='left'>
            <a href="/">
              <img  className="nav-logo" src={titleImg} alt="logo" />
            </a>

            <div className='input-section'>
              <input 
                onChange={(e) => setName(e.target.value)}
                type="text" 
                placeholder='Enter Ticket Name'
              />
              {/* <input 
                // onChange={(e) => setDesc(e.target.value)}
                type="text" 
                placeholder='Enter Ticket Description'
              /> */}
              {name === ''? 
                <button 
                className='create-btn disabled' 
                disabled
                >Create Ticket</button>
              :
                <button 
                className='create-btn' 
                onClick={() => createNewTicket(name)}
                
                >Create Ticket</button>
              }
              
              {isLoading? 
                <img className='loading-gif' src={loadingGif}  alt="loading gif"/>
              : 
                null
              }
              <button className='item load-data-btn' onClick={getTickets}>Load Data (Goerli Network)</button>
            </div>
        </div>
        <div className='right'>
          
          <p className='right-item'>Account:</p>
            {account !== "" ? 
              <p>{account.substring(0,9)}...</p> :
              <button onClick={initConnection}>Connect Wallet</button>
            }
        </div>
      </div>

      <div className='main'>
        <div className='inner'>
            <div className='main_col'>
              <div className='main_col_heading'>To Do</div>
              {tickets
              .map((t, i) => ({id: i, item: t}))
              .filter(t => t.item.status === 0)
              .map((ticket, desc, index) => {
                return (
                  <div className='main_ticket_card' key={index}  id={ticket.id}>
                    <div className='title-container'>
                      <p className='card-title'>{ticket.item.name}</p>
                    </div>
                    <div className='main_ticket_button_section'>
                      <button
                        className='small_button'
                        onClick={() => updateTicketStatus(ticket.id, 1)}
                      >In Progress
                      </button>
                      <button
                        className='small_button'
                        onClick={() => updateTicketStatus(ticket.id, 2)}
                      >Complete
                      </button>
                      <button
                        className='small_button'
                        onClick={() => renameTicket(ticket.id)}
                      >Rename
                      </button>
                      <button
                        className='small_button'
                        onClick={() => removeTicket(ticket.id)}
                      >Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className='main_col'>
              <div className='main_col_heading'>In Progress</div>
                {tickets
                .map((t, i) => ({id: i, item: t}))
                .filter(t => t.item.status === 1)
                .map((ticket, index) => {
                  return (
                    <div className='main_ticket_card' key={index} id={ticket.id}>
                      <div className='title-container'>
                        <p className='card-title'>{ticket.item.name}</p>
                      </div>
                      <div className='main_ticket_button_section'>
                        <button
                          className='small_button'
                          onClick={() => updateTicketStatus(ticket.id, 0)}
                        >ToDo
                        </button>
                        <button
                          className='small_button'
                          onClick={() => updateTicketStatus(ticket.id, 2)}
                        >Complete
                        </button>
                        <button
                          className='small_button'
                          onClick={() => renameTicket(ticket.id)}
                        >Rename
                        </button>
                          <button
                          className='small_button'
                          onClick={() => removeTicket(ticket.id)}
                        >Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
            <div className='main_col'>
              <div className='main_col_heading'>Complete</div>
                {tickets
                .map((t, i) => ({id: i, item: t}))
                .filter(t => t.item.status === 2)
                .map((ticket, index) => {
                  return (
                    <div className='main_ticket_card' key={index}  id={ticket.id}>
                      <div className='title-container'>
                        <p className='card-title'>{ticket.item.name}</p>
                      </div>
                      <div className='main_ticket_button_section'>
                        <button
                          className='small_button'
                          onClick={() => updateTicketStatus(ticket.id, 1)}
                        >In Progress
                        </button>
                        <button
                          className='small_button'
                          onClick={() => renameTicket(ticket.id)}
                        >Rename
                        </button>
                        <button
                          className='small_button'
                          onClick={() => removeTicket(ticket.id)}
                        >Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
        </div>
        
      </div>

      <div className='footer'>
        <script>const BADGE_ID = 'https://alchemy.com/?r=74b8192c10964e6d';</script>
        <script type="text/javascript" src="https://static.alchemyapi.io/scripts/analytics/badge-analytics.js"></script>
        <div className='links-container'>
          <a className="twitter-link" href="https://twitter.com/0xagf0x" target="blank">
              <img  src={twitterLogo} alt="Twitter link" />
          </a>
          <a className="alchemy-link" href="https://alchemy.com/?r=74b8192c10964e6d" target="blank">
              <img  id="badge-button"  src="https://static.alchemyapi.io/images/marketing/badgeLight.png" alt="Alchemy Supercharged" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
