import React,{useContext, useEffect, useRef, useState} from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {postContext} from './state/PostState'
import update from '../assets/update.svg'
import del from '../assets/delete.svg'
import spinner from '../assets/spinner.gif'
export default function Myposts() {
      let navigate = useNavigate();
      const context = useContext(postContext)
      const {posts,getPosts,deletePost} = context;
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        getPosts()
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          navigate("/");
        })
      },[])
      
      function stripHtmlTags(str) {
        if ((str===null) || (str===''))
          return false;
        else
          str = str.toString();
        return str.replace(/<[^>]*>/g, ' ');
      }
      
      return (
        <div className="container" style={{paddingTop : "5%",paddingBottom: "5%"}}>
          {loading ? 
            <div style={{ display: 'flex', justifyContent: 'center',alignItems:"center",height:"70vh"}}>
              <img src={spinner} alt="loading..." width="100px" />
            </div> :
            <>
            <h1>My Posts</h1>
            {posts.map((post) => {
            return (
              <div className="row" key={post._id}>
                <div className='col-md-11'>
                  <h2>{post.title}</h2>
                  <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {stripHtmlTags(post.content).substring(0, 150)}
                    {(post.content.length > 150 || post.images || post.video) && <Link to={{ pathname: `/posts/${post._id}`, state: { post } }}>...Read More</Link>}
                  </p>
                  <div style={{fontFamily: "Lucida Sans,Lucida Sans Regular,Lucida Grande,Lucida Sans Unicode, Geneva, Verdana, sans-serif"}}><i><small>{new Date(post.date).toLocaleString()}</small></i></div>
                </div>
                <div className='col-md-1' style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "20px",width: "2%",padding: "0%"}}>
                  <img className='icon' style={{paddingTop: "150%"}} src={`${update}`} onClick={() => {navigate(`/updatepost/${post._id}`)}}/>
                  <img className='icon' src={`${del}`} onClick={() => {deletePost(post._id)}}/>
                </div>
              </div>
            )
          })}</>}
        </div>
      )
      
}
