import React, { useContext, useEffect, useState, useRef } from 'react';
import { postContext } from './state/PostState';
import { useParams, useNavigate } from 'react-router-dom';
import spinner from '../assets/spinner.gif';
import {jwtDecode} from 'jwt-decode';
import ReactPlayer from 'react-player';
import { marked } from "marked";

export default function Post() {
  let navigate = useNavigate();
  const context = useContext(postContext);
  const { deletePost,Loggedin } = context;
  const [Loading, setLoading] = useState(true);
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const [Prompt,setPrompt] = useState("");
  
  const [Response,setResponse] = useState("");

  const timeouts = useRef([]);

  const [Generating,setGenerating] = useState(false);

  const GeneratingRef = useRef(false);

  useEffect(() => {
    GeneratingRef.current = Generating;
  }, [Generating]);

  const getPost = async () => {
    try {
      const response = await fetch(`https://backend-oup3.onrender.com/post/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const postData = await response.json();
      console.log('Fetched postData:', postData);
      setPost(postData[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setLoading(false);
      navigate('/notfound');
    }
  };

  useEffect(() => {
    getPost();
  }, [id]);

  if(Loggedin)  
  {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    var userId = decodedToken.user.id;
  }

  const onPromptChange = (e) => {
    setPrompt(e.target.value)
  };

  const handlePrompt = async() => {
    setResponse("");
    setGenerating(true);
    fetch("https://backend-oup3.onrender.com/ai_summarize/"+id,{
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({
        prompt: Prompt
      })
    })
    .then(res => res.json())
    .then(data => {
      if (!GeneratingRef.current) {
        // If stopped before response arrived, do nothing here
        return;
      }
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
      const fullText = marked(data.response ? data.response : "Please Enter the message!");
      for (let i = 0; i < fullText.length; i++) {
        const timeout = setTimeout(() => {
          setResponse(prev => prev + fullText.charAt(i));
        }, i * 10);
        timeouts.current.push(timeout);
      }
      const finalTimeout = setTimeout(() => {
        setGenerating(false);
      }, fullText.length * 10);
      timeouts.current.push(finalTimeout);
    });
  }

  return (
    <div className='container' style={{ paddingTop: "5%", paddingBottom: "5%" }}>
      {Loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: "70vh" }}>
          <img src={spinner} alt="loading..." width="100px" />
        </div>
      ) : (
        post && (
          <>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content }}/>
            <button
              className="btn btn-class"
              data-toggle="modal"
              data-target="#exampleModal"
              type="button"
              style={{ marginBottom: "15px" }}
            >
              Ask AI
            </button>
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
            >
              <div className="modal-dialog" role="document" style={{width:"850px", maxWidth:"90%"}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="modal-title" id="exampleModalLabel">
                      Want to explore a bit more? Ask right away!
                    </h4>
                  </div>
                  <div className="modal-body" style={{paddingBottom:"5px"}}>
                    <textarea
                      placeholder="How do i get here from India?"
                      className="form-control"
                      style={{height:"30px",maxWidth:"100%"}}
                      type="text"
                      name="prompt"
                      value={Prompt}
                      onChange={onPromptChange}
                    />
                  <div dangerouslySetInnerHTML={{ __html: Response }} style={{marginTop:"15px"}}/>
                  </div>
                  <div className="modal-footer">
                    {Generating ? (<button
                      type="button"
                      className="btn rbtn-class"
                      // data-dismiss="modal"
                      onClick={() => {timeouts.current.forEach(clearTimeout);timeouts.current = [];setGenerating(false);}}
                    >
                      Stop
                    </button>) :
                    (<button type="button" className="btn btn-class" onClick={handlePrompt}>
                      Ask
                    </button>)}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              {post.images && post.images.map((image, index) => (
                <div key={index} style={{ flexBasis: 'calc(50% - 10px)', maxWidth: '100%', marginTop: '10px', marginRight: '10px' }}>
                  <img src={image.url} alt={`image ${index}`} style={{ width: '100%', height: 'auto' }} />
                </div>
              ))}
            </div>
            {post.video && post.video.url && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
                <ReactPlayer
                  controls={true}
                  url={post.video.url}
                  width={'70%'}
                  pip={true}
                />
              </div>
            )}
            <div style={{ fontFamily: "Lucida Sans,Lucida Sans Regular,Lucida Grande,Lucida Sans Unicode, Geneva, Verdana, sans-serif", fontSize: "18px", marginTop: "20px" }}>
              <i>~ {post.name} <br /> <small>{new Date(post.date).toLocaleString()}</small></i>
            </div>
            {Loggedin && userId === post.user && (
              <div className='row' style={{ marginTop: "1%" }}>
                <button className="btn btn-class col-md-1" style={{ marginLeft: "1%", marginRight: "2%" }} type="submit" name="button" onClick={() => { navigate(`/updatepost/${post._id}`) }}>Edit</button>
                <button className="btn btn-class col-md-1" type="submit" name="button" onClick={() => { deletePost(post._id); navigate("/"); }}>Delete</button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
