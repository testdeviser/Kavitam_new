import React,{useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Swal from 'sweetalert2';

function Model({show,showmodel,handleClose,handleShow,refferralCode,setShow}) {
   
    const [inputs,setinputs]=useState({       
        email:'',
        err:[],
    });
   const handleSubmit=async(e)=>{
     e.preventDefault();
    try
     {  
        const data={
        email:inputs.email,
        refferralCode:refferralCode,
        };

        axios.post(`/api/send-RefferalCode`,data).then(res=>
        {
           
            if(res.data.status==200)
            {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                setShow({...show,model:false});
            }
            else
            {
              setinputs({...inputs,err:res.data.error});
            }

           }).catch(error=>{
            console.log(error);
           });
    }
    catch(err)
    {
      console.log(err);
    }
     
      
    }

    return(
        <>         

      <Modal show={showmodel} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Refferral code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Kindly introduce your friends and family to us. Share your unique  <br/> referralCode:<b>{refferralCode}</b>    
          <div>
            <form action="" className='mt-3' onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email" className='form-control' onChange={(e)=>{setinputs({...inputs,email:e.target.value})}}/>
                         <span className='text-danger'>{inputs.err['email']?inputs.err['email']:''}</span>
                    </div>              
                    <div>
                        <button type="submit" className='btn btn-success button' value='Send'>Send</button>                   
                        <button className='btn bg-secondary' onClick={handleClose} style={{'marginLeft':'5px'}}>
                            Close
                        </button>                       
                    </div>
              </form>      
          </div>     
           
            
        </Modal.Body>
        {/* <Modal.Footer>
         
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
    );
   
}
export default Model;