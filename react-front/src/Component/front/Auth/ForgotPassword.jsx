import React from 'react';

function ForgotPassword(props) {
    const handleSubmit=async()=>{
      console.log('hey');
    }

    return (
        <div className='me-auto' style={{'display':'flex','justifyContent':'center','marginTop':'8vh'}}>
               <div className="card" style={{width:'30rem'}}> 
               <div className="card-body">
                   <h5 className="card-title">Forgot Password</h5><hr/>
                   <form action="" onSubmit={handleSubmit}>
                        <div className="mb-3">
                           <label htmlFor="login">Email</label>
                           <input type="text" name="" id="login" className='form-control' />                          
                        </div>                      
                        <div>
                           <button type="submit" className='btn btn-success' value='Submit'>Send Password Reset Link</button>
                        </div>
                   </form>                 
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;