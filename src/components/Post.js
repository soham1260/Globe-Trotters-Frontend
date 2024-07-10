import React,{ useContext,useEffect,useState  } from 'react';
import {postContext} from './state/PostState'
import { useParams,useNavigate  } from 'react-router-dom';
import spinner from '../assets/spinner.gif'
import {jwtDecode} from 'jwt-decode';
import ReactPlayer from 'react-player';
export default function Post() {
    let navigate = useNavigate();
    const context = useContext(postContext)
    const {posts,getAllPosts,deletePost} = context;
    const [Post, setPost] = useState(null);
    const { id } = useParams();
    useEffect(() => {
    if(localStorage.getItem('token'))
    {
        getAllPosts()
        .then(() => {
          return posts.find(post => post._id === id);
        })
        .then((post) => {
          !post? navigate("/") : setPost(post)
        })
    }
    else
    {
        navigate("/signup");
    }
    },[])
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user.id;
    return (
    <div className='container' style={{paddingTop : "5%",paddingBottom: "5%"}}>
      { !Post ? 
        <div style={{ display: 'flex', justifyContent: 'center',alignItems:"center",height:"100vh"}}>
          <img src={spinner} alt="loading..." width="100px" />
        </div> : 
        <><h1>{Post.title}</h1>
        <p dangerouslySetInnerHTML={{ __html: Post.content }}></p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {Post.images.map((image, index) => (
            <div key={index} style={{ flexBasis: 'calc(50% - 10px)', maxWidth: '100%', marginTop: '10px', marginRight: '10px' }}>
              <img src={image.url} style={{ width: '100%', height: 'auto' }} />
            </div>
          ))}
        </div>
        
        {Post.video.url.length!==0 && <div style={{ display:"flex", justifyContent: "center", marginTop: "50px"}}>
          <ReactPlayer
            controls={true}
            url={Post.video.url}
            width={'70%'}
            pip={true}
          />
        </div>}

        <div style={{fontFamily: "Lucida Sans,Lucida Sans Regular,Lucida Grande,Lucida Sans Unicode, Geneva, Verdana, sans-serif", fontSize: "18px" , marginTop: "20px"}}><i>~ {Post.name} <br/> <small>{new Date(Post.date).toLocaleString()}</small></i></div>
        {userId === Post.user && <div className='row' style={{marginTop: "1%"}}>
          <button className="btn btn-class col-md-1" style={{marginLeft: "1%", marginRight: "2%"}} type="submit" name="button" onClick={() => {navigate(`/updatepost/${Post._id}`)}}>Edit</button>
          <button className="btn btn-class col-md-1" type="submit" name="button" onClick={() => {deletePost(Post._id);navigate("/");}}>Delete</button>
        </div>}
        </>
      }
      
    </div>
  )
}
