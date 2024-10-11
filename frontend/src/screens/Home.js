import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';

export default function Home() {
  const [search, setSearch] = useState("");
  const [blogCat, setBlogCat] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const isDtop = useMediaQuery({ query: '(min-width: 768px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 570px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 570px)' });
  const loadData = async () => {
    let response = await fetch(`${process.env.BACKEND_URL}/api/blogdata`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    response = await response.json();
    console.log(response)
    setBlogData(response[0]);
    setBlogCat(response[1]);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Navbar />

      <div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner" id='carousel'>
          {isMobile && (
          <div className="justify-content-center">
                  <input
                          className="form-control me-2"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        </div>
          )}
            <div className="carousel-caption" style={{ zIndex: "10" }}>
              <div className="justify-content-center mb-5">
              {isDesktop && (
                <>
              <h1 className=" text-light fs-3 fw-bold">Explore Our World of Blogs</h1>
              <p className="text-dark fs-4">Dive into captivating stories, ideas, and insights on a wide range of topics!</p>
              </>
              )}
              {isMobile && (
                <>
              <h1 className="text-light fs-5 fw-bold">Explore Our World of Blogs</h1>
              <p className="text-dark fs-4">Dive into captivating stories, ideas, and insights on a wide range of topics!</p>
              </>
              )}
              {isDesktop && (
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
              </div>
            </div>
            <div className="carousel-item active">
              <img src="/Image/blog1.jpeg" className="d-block w-100" alt="Nature" />
            </div>
            <div className="carousel-item">
              <img src="/Image/blog2.jpeg" className="d-block w-100" alt="Sports" />
            </div>
            <div className="carousel-item">
              <img src="/Image/blog3.jpeg" className="d-block w-100" alt="Travel" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="container">
        {blogCat.length > 0 ? (
          blogCat.map((data) => {
            const filteredBlogs = blogData.filter(blog =>
              blog.categoryName === data.categoryName &&
              blog.title.toLowerCase().includes(search.toLowerCase())
            );

            if (filteredBlogs.length > 0) {
              return (
                <div className="row mb-3" key={data._id}>
                  <div className="fs-3 mb-3 mt-3">{data.categoryName}</div>
                  <hr />
                  {filteredBlogs.map((filterblogs) => (
                    <div key={filterblogs._id} className="col-12 col-md-6 col-lg-3">
                      <Card blogData={filterblogs} />
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })
        ) : (
          <p>No blogs available</p>
        )}

        {blogData.length > 0 && blogCat.every(cat => {
          const hasBlogs = blogData.some(blog =>
            blog.title.toLowerCase().includes(search.toLowerCase())
          );
          return !hasBlogs;
        }) && (
          <div className="text-center mt-4">
            <h5>No results found</h5>
          </div>
        )}
      </div>

      {isDtop && (
      <Footer />
      )}
    </div>
  );
}
