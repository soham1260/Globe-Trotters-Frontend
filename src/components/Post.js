import React, { useContext, useEffect, useState } from 'react';
import { postContext } from './state/PostState';
import { useParams, useNavigate } from 'react-router-dom';
import spinner from '../assets/spinner.gif';
import {jwtDecode} from 'jwt-decode';
import ReactPlayer from 'react-player';

export default function Post() {
  let navigate = useNavigate();
  const context = useContext(postContext);
  const { deletePost } = context;
  const [Loading, setLoading] = useState(true);
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const getPost = async () => {
    try {
      const response = await fetch(`https://backend-oup3.onrender.com/post/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Token is invalid or request failed');
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

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.user.id;

  console.log('Post state:', post);
  console.log('Loading state:', Loading);

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
            <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
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
            {userId === post.user && (
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
