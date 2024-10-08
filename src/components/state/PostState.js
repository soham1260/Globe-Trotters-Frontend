import React from 'react'
import { createContext,useState } from "react";
import { useNavigate } from 'react-router-dom';
export const postContext = createContext();

export default function PostState(props) {
    const postsInitial = []

    const [posts, setposts] = useState(postsInitial);
    const [Search, setSearch] = useState(false);
    const [Loggedin, setLoggedin] = useState(false);
    const navigate = useNavigate();
    
    const url="https://backend-oup3.onrender.com";

    const checkUser = async () => {
      try {
        const response = await fetch(`${url}/isloggedin`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        });
    
        if (!response.ok) {
          setLoggedin(false);
          throw new Error('Token is invalid or request failed');
        }
        setLoggedin(true);
      } catch (error) {
        setLoggedin(false);
      }
    };

    const getPosts = async () => {
      try {
        const response = await fetch(`${url}/fetchposts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        });
    
        if (!response.ok) {
          throw new Error('Token is invalid or request failed');
        }
    
        const json = await response.json();
        setposts(json);
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    };
    
    const search = async (query) => {
      setSearch(false);
      try {
        const response = await fetch(`${url}/search/${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        });
    
        if (!response.ok) {
          throw new Error('Token is invalid or request failed');
        }
    
        const json = await response.json();
        if(json.length === 0) setSearch(true);
        setposts(json);
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    };

    const getAllPosts = async () => {
      try {
        const response = await fetch(`${url}/fetchallposts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        });
    
        if (!response.ok) {
          throw new Error('Token is invalid or request failed');
        }
    
        const json = await response.json();
        setposts(json);
      } catch (error) {
        console.error(error);
        navigate("/signup");
      }
    };

    const addPost = async (title,content,files,video,isurl,videourl) => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('videourl', videourl);
      formData.append('video', video);
      files.forEach((file) => formData.append('file', file));
      
      const response = await fetch(`${url}/compose`,{
          method : 'POST',
          headers : {'auth-token' : localStorage.getItem('token')},
          body : formData
      });
      return response.ok;
    }

    const deletePost = async (id) => {
      await fetch(`${url}/deletepost/${id}`,{method : 'DELETE',headers : {'Content-Type' : 'application/json','auth-token' : localStorage.getItem('token')}});
      const newpost = posts.filter((post) => {return post._id !== id});
      setposts(newpost);
    }

    const editPost = async (id,title,content,removeFiles,newFiles,video,videourl,videochange) => {
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('videourl', videourl);
      formData.append('videochange', videochange);
      formData.append('video', video);
      formData.append('removeFiles', JSON.stringify(removeFiles));
      newFiles.forEach((file) => formData.append('file', file));
      const response = await fetch(`${url}/updatepost/${id}`,{
          method : 'PUT',
          headers : {'auth-token' : localStorage.getItem('token')},
          body : formData
      });
      
      return response.ok;
    }

  return (
      <postContext.Provider value={{posts,addPost , deletePost , editPost, getPosts, getAllPosts, search, setposts, Search, setSearch, Loggedin, setLoggedin, checkUser}}>
          {props.children}
      </postContext.Provider>
  )
}
