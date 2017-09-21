import React from 'react';

import './App.css';

const DEFAULT_QUERY = 'react';
const DEFAULT_PAGE = 0;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const DEFAULT_HPP = '10';
const PARAM_HPP = 'hitsPerPage=';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this); 
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this); 
    }

    componentDidMount(){
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        this.fetchSearchTopStories(searchTerm,DEFAULT_PAGE);
    }
    
    needsToSearchTopStories(searchTerm){
        return !this.state.results[searchTerm];
    }


    fetchSearchTopStories(searchTerm,page){
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(e => e);
    }

    setSearchTopStories(result){
        const {hits,page} = result;
        const {searchKey, results} = this.state;

        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
        const updatedHits = [...oldHits, ...hits];
        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            }
        });
    }

    onDismiss(id){
        const {searchKey, results} = this.state;
        const {hits, page} = results[searchKey];

        const updatedHits = hits.filter(item => item.objectID !== id);
        this.setState({
            results: {
                ...results, 
                [searchKey]: {hits: updatedHits, page}
            }
        });
    }

    onSearchChange(event){
        this.setState({searchTerm: event.currentTarget.value})
    }

    onSearchSubmit(event){
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        if(this.needsToSearchTopStories(searchTerm)){
            this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
        }
        event.preventDefault();
    }

    render() {
        const {searchTerm, results, searchKey} = this.state;
        const page = (results && results[searchKey] && results[searchKey].page) || 0;
        const list = (results && results[searchKey] && results[searchKey].hits) || [];

        return (
            <div className="page">
                <div className='interactions'>
                    <Search 
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    >
                        Search: 
                    </Search>
                </div>
                    <Table 
                        list={list}
                        onDismiss={this.onDismiss}
                    />
                <div className='interactions'>
                    <Button onClick={()=>this.fetchSearchTopStories(searchKey,page+1)}>
                        More
                    </Button>
                </div>
                
            </div>
        );
    }
}


const Search = ({value, onChange, onSubmit, children}) => {
    return(
        <form onSubmit={onSubmit}>
            <strong>{children}</strong>
            <input 
                type='text' 
                value={value}
                onChange={onChange}
            />
            <button type='submit'>
                {children}
            </button>
        </form>
    );
}


const Table = ({list, onDismiss}) => {
    return(
        <div className='table'>
            {list.map((item)=>
                <div key={item.objectID} className='table-row'>
                    <span>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span>{item.author}</span>
                    <span>{item.num_comments}</span>
                    <span>{item.points}</span>
                    <span>
                        <Button onClick={()=>onDismiss(item.objectID)}>
                            Anihilate
                        </Button>
                    </span>
                </div>                    
            )}
        </div>
    );
}

const Button = ({onClick,className='',children}) => {
    return (
        <button
            onClick={onClick}
            className={className}
            type="button"
        >
            {children}
        </button>
    );
}


export default App;
