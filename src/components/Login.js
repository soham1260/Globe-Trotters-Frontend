import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom'
import login from '../assets/login.jpg'
import './login.css'
import google from '../assets/google.png'

export default function Login() {

	const [Credentials, setCredentials] = useState({email : "",password : ""});
    let navigate = useNavigate();
	const [Error, setError] = useState(false);
	const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://backend-oup3.onrender.com/login`,{method : 'POST',headers : {'Content-Type' : 'application/json'},body : JSON.stringify({email : Credentials.email,password : Credentials.password})});
        const json=await response.json();
        console.log(json);

        if(json.success)
        {
            localStorage.setItem('token',json.authtoken);
            navigate('/');
        }
		else
		{
			setError(!Error);
		}
    }

	const onChange = (e) => {
        setCredentials({...Credentials,[e.target.name] : e.target.value})
    }

	return (
		<div className="container" style={{backgroundColor : "#1abc9c" , margin : "0%",width: "100%"}}>
			<div className="row content">
				<div className="col-md-12">
					<h1 className="header-text" style={{ fontSize: '5rem' }}>Globe Trotters</h1>
				</div>
			<div className="col-md-6 mb-3">
			<img src={login}alt="Image in login page" width="500px"/>
			</div>
			<div className="col-md-6" style={{ paddingTop: '4%' ,fontSize: "larger"}}>
				<h1 className="signin-text">Continue Your Journey</h1>
				<form onSubmit={handleSubmit}>
				<div className="form-group formfont">
					<label htmlFor="email">Email</label>
					<input type="email" name="email" className="form-control" value={Credentials.email} onChange={onChange}/>
				</div>
				<div className="form-group formfont">
					<label htmlFor="password">Password</label>
					<input type="password" name="password" className="form-control" value={Credentials.password} onChange={onChange}/>
				</div>
				{
					Error && <p className="error-message">Invalid Email or Password</p>
				}
				<div className="form-group">
					New Explorer, <Link to="/signup" >Join Us</Link>
				</div>
				<button className="btn btn-class" style={{marginRight:"10px"}} onClick={(e) => {e.preventDefault(); window.location.href = "https://backend-oup3.onrender.com/auth/google";}}><img src={google} style={{width:"20px",marginRight:"5px"}}/>Google</button>
				<button className="btn btn-class">Explore</button>
				</form>
			</div>
			</div>
		</div>
  	)
}
