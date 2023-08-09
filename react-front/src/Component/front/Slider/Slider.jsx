import React,{useState} from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import { FaGift,FaUniversity,FaLuggageCart} from 'react-icons/fa';
import { MdOutlineSecurity } from "react-icons/md";

function Slider()
{ 
   var user='';
    if(!localStorage.getItem('auth_token'))
    {
       user=('Guest');
    }
    else{
        user=(localStorage.getItem('auth_name'));
    }
    return(
    <div>       
        <Carousel>
      <Carousel.Item>
        <img
          className="d-block"
          src={process.env.PUBLIC_URL + '/image/andrey-metelev-DEuansgqjns-unsplash.jpg'}
          alt="First slide"
          style={{'width':'100vw','height':'93vh'}}
        />
        <Carousel.Caption>
          <h3>Get ready to Play!</h3>
          <p>You just have to take a deep breath, relax and let the game come to you.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block" src={process.env.PUBLIC_URL + '/image/ays-be-BD4pN-2zw7s-unsplash.jpg'} alt="Second slide"  style={{'width':'100vw','height':'93vh'}}/>

        <Carousel.Caption>
          <h3>Politics is not a game.</h3>
          <p> It is an earnest business.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block "
          src={process.env.PUBLIC_URL + '/image/krissia-cruz-FwPzGn59wNs-unsplash.jpg'}
          alt="Third slide"
          style={{'width':'100vw','height':'93vh'}}
        />
        <Carousel.Caption>
          <h3>Life is a difficult game</h3>
          <p>
          You can win it only by retaining your birthright to be a person..
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>       
<div >
   
         <div className='row'>
           <div className='col-md-4'>
              <Card >             
                <Card.Body>
                   <div className="row">
                    <div className="col-md-4">
                       <FaGift size={60} />
                    </div> 
                    <div className='col-md-8'>
                      <h6>Refer  & Win</h6>
                      <p>Refer a friend and win rewards</p>                      
                      </div>              
                   </div>
                </Card.Body>
              </Card>
           </div>
       
        
           <div className='col-md-4'>
            <Card >             
                  <Card.Body>
                    <div className="row">
                      <div className="col-md-4">
                        <MdOutlineSecurity size={60} />
                      </div> 
                      <div className='col-md-8'>
                        <h6>Data Security</h6>
                        <p>Lorem ipsum dolor sit amet.</p>                      
                        </div>                
                    </div>
                  </Card.Body>
                </Card>
           </div>
        
         
           <div className='col-md-4'>
            <Card >             
                  <Card.Body>
                    <div className="row">
                      <div className="col-md-4">
                        <FaUniversity size={60} />
                      </div> 
                      <div className='col-md-8'>
                        <h6>100% Payment Secure</h6>
                        <p>Secure payments methods</p>                      
                        </div>                
                    </div>
                  </Card.Body>
            </Card>
         </div>
         </div>    
   </div>
    </div>
    );
}
export default Slider;