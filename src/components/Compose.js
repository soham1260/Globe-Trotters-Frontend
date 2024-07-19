import React, { useContext, useState, useCallback,useEffect } from "react";
import { postContext } from "./state/PostState";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { useDropzone } from "react-dropzone";
import request from "superagent";
import spinner from "../assets/spinner.gif";
import ReactPlayer from 'react-player';
import "react-quill/dist/quill.snow.css"; // import the styles

export default function Compose() {
  const navigate = useNavigate();
  const context = useContext(postContext);
  const { addPost,Loggedin } = context;

  const [Post, setPost] = useState({ title: "", content: "" });

  const [Error, setError] = useState({ title: false, content: false });

  const [Files, setFiles] = useState([]);

  const [Loading, setLoading] = useState(false);

  const [Video,setVideo] = useState();

  const [Videourl,setVideourl] = useState("");

  useEffect(() => {
    if(!Loggedin)
    {
      navigate("/");
    }
  });

  const handleClick = async (e) => {
    e.preventDefault();
    if (!Post.title) {
      setError({ title: true, content: false });
      if (!Post.content) {
        setError({ title: true, content: true });
      }
    } else if (!Post.content) {
      setError({ title: false, content: true });
    } else {
      setLoading(true);
      try {
        let response;
        if(Video) response = await addPost(Post.title, Post.content, Files,Video,false,"");
        else response = await addPost(Post.title, Post.content, Files,null,true,Videourl);
        setLoading(false);
        if (response) {
          setPost({ title: "", content: "" });
          setFiles([]);
          navigate("/my-posts");
        } else {
          alert("Internal Server Error, please try again");
        }
      } catch (error) {
        console.error("Error adding post:", error);
        setLoading(false);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const onChange = (e) => {
    if (e.target) {
      setPost({ ...Post, [e.target.name]: e.target.value });
    } else {
      setPost({ ...Post, content: e });
    }
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    //maxSize : 1024 * 1000
  });

  const onVideoDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setVideo(Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) }))
    }
  }, []);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
    disabled:Videourl.length!==0,
    onDrop: onVideoDrop,
    accept: {
      "video/*": [],
    },
    maxFiles: 1
  });


  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const onurlChange = (e) => {
    setVideourl(e.target.value)
  }

  const input = {
    border: "1px dashed grey",
    height: "30px",
    width: "auto",
    borderRadius: "5px",
    fontWeight: "400",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  };
  return (
    <div
      className="container"
      style={{ paddingTop: "5%", paddingBottom: "5%" }}
    >
      {Loading ? (
        <div style={{ display: "flex", justifyContent: "center",alignItems:"center",height:"100vh" }}>
          <img src={spinner} alt="loading..." width="100px" />
        </div>
      ) : (
        <>
          <h1>Compose</h1>
          <form>
            <div className="form-group">
              <label style={{ fontSize: "larger" }}>Title</label>
              <input
                className="form-control"
                type="text"
                name="title"
                value={Post.title}
                onChange={onChange}
              />
              {Error.title && (
                <p className="error-message">Please Enter title</p>
              )}
              <label style={{ fontSize: "larger", marginTop: "2%" }}>
                Post
              </label>
              <ReactQuill value={Post.content} onChange={onChange} />
              {Error.content && (
                <p className="error-message">Please Enter content</p>
              )}
            </div>
            <div>
              <div style={input} {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p style={{ margin: "0px" }}>Drop the files here ...</p>
                ) : (
                  <p style={{ margin: "0px" }}>
                    Drag 'n' drop some images here, or click to select files
                  </p>
                )}
              </div>
              <ul
                style={{
                  listStyleType: "none",
                  display: "flex",
                  gap: "3%",
                  marginTop: "2%",
                }}
              >
                {Files.map((file) => (
                  <li key={file.name}>
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <img
                        src={file.preview}
                        alt=""
                        width={"100px"}
                        height={"100px"}
                      />
                      <button
                        className="robtn-class"
                        onClick={() => {
                          removeFile(file.name);
                        }}
                      >
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
            <div style={{ ...input, opacity: Videourl.length !== 0 ? 0.5 : 1 }} {...getVideoRootProps()}>
              <input {...getVideoInputProps()} />
              {isVideoDragActive ? (
                <p style={{ margin: "0px" }}>Drop the video here ...</p>
              ) : (
                <p style={{ margin: "0px" }}>Drag 'n' drop a video here, or click to select file</p>
              )}
            </div>
            <div style={{paddingTop: "10px", opacity: Video ? 0.5 : 1}}>
              or, provide a url <input
                className="form-control"
                type="text"
                name="title"
                value={Videourl}
                placeholder="https://www.youtube.com/<videoid>"
                onChange={onurlChange}
                disabled={Video}
              />
            </div>
            {(Video || Videourl) && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" , marginBottom: "20px"}}>
                <button className="btn rbtn-class" onClick={() => { Video ? setVideo() : setVideourl("") }} style={{marginBottom: "10px"}}>Remove Video</button>
                <div style={{display: "flex", justifyContent: "center" }}>
                  <ReactPlayer
                    controls={true}
                    url={Video ? Video.preview : Videourl}
                    pip={true}
                  />
                </div>
              </div>
            )}
          </div>

            <button
              className="btn btn-class"
              type="submit"
              name="button"
              onClick={handleClick}
              style={{marginTop: "10px"}}
            >
              Publish
            </button>
          </form>
        </>
      )}
    </div>
  );
}
