import React, {useEffect, useState} from 'react'


import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

const News = (props) => {
     const [articles,setArticles]=useState ([])  
     const[loading,setLoading]=useState (true)
     const[page,setPage]= useState(1)
     const[totalResults,setTotalResults]= useState(0)


    const capitalizeFirstLetter=(string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async ()=> {
        props.setProgress(10); 
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=2aa6a28f2f454e3294ffd9a51d12d890&page=${page}&pagesize=${props.pageSize}`;
       
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30); 
        let parsedData = await data.json()
        props.setProgress(70); 
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100); 
    }
    useEffect(() => {
        document.title = `RazeNews - ${capitalizeFirstLetter(props.category)}`;
        updateNews();
    }, [])

   
     const handlePrevClick = async () => {
        setPage(page-1);
        updateNews();
    }

     const handleNextClick = async () => {

        setPage(page+1);
        updateNews();

    }

   
        return (  
             <> 
               <h1 className="text-center" style={{margin:'35px',marginTop :'90px'}}>RazeNews - Top {capitalizeFirstLetter(props.category)} Headlines </h1>
                {loading && <Spinner/>}
                <div className = "container">
                <div className="row">
                    {articles.map((element)=>{
                        return <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                        </div>
                    })}
               </div>    
                </div>
                <div className="container d-flex justify-content-between">
                    <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePrevClick}> &larr; Previous</button>
                    <button disabled={page + 1 > Math.ceil(totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button>
                </div>

            </>
        )
    
}
News.defaultProps = {
    country: 'in',
    pageSize: 21,
    category: 'general',
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News
