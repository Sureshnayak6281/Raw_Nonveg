import React,{useState} from 'react'
import axios from 'axios'
import config from '../../config';
import { useNavigate } from 'react-router-dom';


export default function Verify(){

    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 
    const verificationCode = code;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');


        try{
            const url = `${config.API_URL}/verify`;
            const response = await axios.post(url,{
                verificationCode
                
            })
            alert(response.data);
            console.log('Successfully verified:', response.data);
            // onVerificationSuccess();
            navigate('/login');

        }
        catch(error){
            alert('please check the code');
            console.error('something wrong during verifying', error);

        }
        setCode('');
        setIsLoading(false);

    }

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card verification-card" style={{ maxWidth: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Email Verification</h2>
                    <p className="text-center mb-4">
                        We've sent a verification code to email. 
                        Please enter the code below to verify your email address.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter verification code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <button 
                            type="submit" 
                            className="btn btn-warning btn-block"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>
                    <p className="mt-3 text-center">
                        Didn't receive the code? <a href="#">Resend Code</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

