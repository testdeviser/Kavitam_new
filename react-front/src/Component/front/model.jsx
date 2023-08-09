import axios from 'axios';
import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BiRupee } from "react-icons/bi";

function Prize_Model_box({ show, handleClose, handleShow, SingleMainkey, gameName, eventId, ...props }) {
  const [outer, setouter] = useState();
  const mainprize = useRef();
  const [main_all, setmain_all] = useState([]);

  const changeColor = (e, key) => {
    setouter(key);
    const target = e.currentTarget;
    const p = target.children[0].innerText;
    mainprize.current = p;
  }

  function handleSave(e) {
    // setSelectedNumbers(...selectedNumbers, {SingleMainkey, currentPrice: mainprize.current})
    // console.log(selectedNumbers);
    const data = {
      number: SingleMainkey,
      prize: mainprize.current,
      eventId: eventId,
    }

    // if(gameName=='main' && data.prize)
    if (gameName == 'main') {
      if (data.prize) {
        props.hangle_main_key('ok');
        axios.post(`api/mainNumber/create`, data).then(res => {
          console.log(res);
        });
      } else {
        alert("Please select entry amount");
      }
    }
    else if (gameName == 'inner') {
      if (data.prize) {
        props.handle_innerkey('ok');
        axios.post(`api/innerNumber/create`, data).then(res => {
          console.log(res);
        });
      } else {
        alert("Please select entry amount");
      }

    }
    else if (gameName == 'outer') {
      if (data.prize) {
        props.handle_outerkey('ok');
        axios.post(`api/outerNumber/create`, data).then(res => {
          console.log(res);
        });
      } else {
        alert("Please select entry amount");
      }
    }
    else {

    }

  }

  var prize = 0;
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton >
          <Modal.Title >Select Entry Ammount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row m-auto">
            {[...Array(5)].map((n, i) => {
              prize += 100;
              return (
                <div className={outer == i ? "card m-1 bg-success zoom pointer" : "card m-1  zoom pointer"} style={{ "width": "8rem", 'textAlign': 'center' }} key={i} onClick={(e) => changeColor(e, i)}>
                  <h5 className="card-title "><BiRupee />{prize}</h5>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer className='m-auto'>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Prize_Model_box;
