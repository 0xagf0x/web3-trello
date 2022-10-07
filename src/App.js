import {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import Manager from './artifacts/contracts/Manager.sol/Manager.json';
import './scss/main.scss';
import titleImg from './assets/trello.gif';
import loadingGif from './assets/loading.gif';

function App() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [tickets, setTickets] = useState([]);
  const[isLoading, setIsLoading] = useState(false);

  const getTickets = async() => {
    const result = await contract.getAllTickets();
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



  // const deleteTicket = async(_index) => {
  //   const result = await contract.deleteTicket(_index);
  //   await result.wait();
  //   getTickets();
  // }

   const deleteTicket = async() => {
    console.log('delete')
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
          '0xDaba8744f0a2af91e807fCd8DF46BCf358fd6C84',
          Manager.abi,
          signer
        )
      );
    } else {
      console.log('Please install MetaMask.')
    }
  }

  useEffect(() => {
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
              <input 
                onChange={(e) => setDesc(e.target.value)}
                type="text" 
                placeholder='Enter Ticket Description'
              />
              <button className='create-btn' onClick={() => createNewTicket(name)}>Create Ticket</button>
              {isLoading? 
                <img className='loading-gif' src={loadingGif}  alt="loading gif"/>
              : 
                null
              }
              <button className='item' onClick={getTickets}>Load Data</button>
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
        <div className='main_col'>
          <div className='main_col_heading'>To Do</div>
          {tickets
          .map((t, i) => ({id: i, item: t}))
          .filter(t => t.item.status === 0)
          .map((ticket, desc, index) => {
            return (
              <div className='main_ticket_card' key={index}  id={ticket.id}>
                <div className='title-container'>
                  <p>{ticket.item.name}</p>
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
                    onClick={() => deleteTicket(ticket.id)}
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
                    <p>{ticket.item.name}</p>
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
                      onClick={() => deleteTicket(ticket.id)}
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
                    <p>{ticket.item.name}</p>
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
                      onClick={() => deleteTicket(ticket.id)}
                    >Delete
                    </button>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
