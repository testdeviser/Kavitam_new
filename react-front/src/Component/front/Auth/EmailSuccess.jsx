import React from 'react';
import {FaGamepad} from 'react-icons/fa'; 
import {Link,useSearchParams} from 'react-router-dom'; 

function EmailSuccess(props) {
  const[searchParams]=useSearchParams();
    return (
        <div className='me-auto' style={{'display':'flex','justifyContent':'center','marginTop':'8vh'}}>
        <div className="card" style={{width:'50rem'}}> 
        <div className="card-body">
            <h5 className="card-title text-primary"><FaGamepad size={30}/> Gaming Point  </h5><hr/>
            <h1>Hii {searchParams.get("name")}</h1>
              <h5>Login Details sent to your email {searchParams.get('email')}</h5>
                <Link className='btn bg-success circle my-3 ' to="/login">Click here for login</Link>            
              <p>Thank you for using gaming point</p>                       
         </div>
     </div>
 </div>
    );
}
export default EmailSuccess;