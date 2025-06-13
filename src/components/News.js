import React, { Component } from 'react';
import PropTypes from 'prop-types'; // Ensure PropTypes is imported
import Newsitems from './Newsitems';
import Spinner from './Spinner';

export class News extends Component {
  
  // Default props for the component
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
  };

  // Prop types validation
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    };
  }

  // Fetch news data when the component mounts
  async componentDidMount() {
    this.fetchNews();
  }

  // Fetching news based on the current page and props
  fetchNews = async () => {
    const { country, category, pageSize } = this.props;
    const { page } = this.state;
    const apiKey = 'YOUR API KEY';

    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    
    this.setState({ loading: true });

    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  };

  handlePreviousClick = async () => {
    this.setState((prevState) => ({ page: prevState.page - 1 }), () => this.fetchNews());
  };

  handleNextClick = async () => {
    this.setState((prevState) => ({ page: prevState.page + 1 }), () => this.fetchNews());
  };

  render() {
    const { articles, loading, page, totalResults } = this.state;
    const { pageSize } = this.props;

    return (
      <div className="container my-3">
        <h1 className="text-center">NewsMania: Top Headlines</h1>
        
        {loading && <Spinner />}

        <div className="row">
          {!loading && articles.map((element) => (
            <div className="col-md-4" key={element.url}>
              <Newsitems
                title={element.title}
                description={element.description}
                imageUrl={element.urlToImage}
                newsUrl={element.url}
              />
            </div>
          ))}
        </div>

        <div className="container d-flex justify-content-between">
          <button
            disabled={page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePreviousClick}
          >
            &larr; Previous
          </button>
          
          <button
            disabled={page >= Math.ceil(totalResults / pageSize)}
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
