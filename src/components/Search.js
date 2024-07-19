import React,{useState,useEffect,useContext} from 'react';
import { Link } from 'react-router-dom';
import spinner from "../assets/spinner.gif";
import notfound from "../assets/notfound.png";
import { postContext } from "./state/PostState";

export default function Search() {

    const [Loading, setLoading] = useState(false);
    const [Input, setInput] = useState("");
    const [Error, setError] = useState(false);

    const context = useContext(postContext);
    const { posts, search, setposts, Search, setSearch } = context;

    useEffect(() => {
        setposts([]);
        setSearch(false);
      },[]);

      function stripHtmlTags(str) {
        if (str === null || str === "") return false;
        else str = str.toString();
        str = str.replace(/<[^>]*>/g, " ");
        str = str.replace(/[\n\r\t]/g, " ");
        return str;
      }

      const handleSubmit = (e) => {
        e.preventDefault();
        if(!Input) {
            setError(true);
        }
        else{
            setError(false);
            search(Input);
        }
      }
  return (
    <div className="container" style={{ paddingTop: "5%", paddingBottom: "5%" }}>
      {Loading ? (
        <div style={{ display: "flex", justifyContent: "center",alignItems:"center",height:"100vh" }}>
          <img src={spinner} alt="loading..." width="100px" />
        </div>
      ) : (
        <>
            <h1>Search</h1>
            <form>
                <div className="form-group">
                <input className="form-control" type="text" name="title" placeholder='Explore' value={Input} onChange={(e) => {setInput(e.target.value)}}/>
                {Error && (
                    <p className="error-message" style={{marginTop:"0.5%"}}>Search cannot be empty</p>
                )}
                <button className="btn btn-class" type="submit" name="button" style={{marginTop: "10px"}} onClick={handleSubmit}>Search</button>
                </div>
            </form>
            {posts.map((post) => {
            return (
              <div key={post._id}>
                  <h1>{post.title}</h1>
                  <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {stripHtmlTags(post.content).substring(0, 150)}
                    {(post.content.length > 150 || post.images || post.video) && <Link to={{ pathname: `/posts/${post._id}`, state: { post } }}>...Read More</Link>}
                  </p>
                  <div style={{fontFamily: "Lucida Sans,Lucida Sans Regular,Lucida Grande,Lucida Sans Unicode, Geneva, Verdana, sans-serif"}}><i>~ {post.name} <br/><small>{new Date(post.date).toLocaleString()}</small></i></div>
              </div>
            )
          })}
          { Search && <div style={{display:"flex",justifyContent:"center",marginTop:"5%"}}><img src={notfound} width={"40%"}/></div>}
        </>
      )}
    </div>
  )
}
