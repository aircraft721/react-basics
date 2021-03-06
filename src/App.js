import React from 'react';


import './App.css';
import {
     DEFAULT_QUERY,
     DEFAULT_PAGE,
     PATH_BASE,
     PATH_SEARCH,
     PARAM_SEARCH,
     PARAM_PAGE,
     DEFAULT_HPP,
     PARAM_HPP
} from './constants/index';

import Button from './components/Button';
import Search from './components/Search';
import Table from './components/Table';

const Loading = () => {
    return(
        <div>Loading ...</div>
    );
}

const withLoading = (Component) => ({isLoading, ...rest}) => {
    return (
        isLoading ? <Loading /> : <Component {...rest} />
    );
}

const ButtonWithLoading = withLoading(Button);



class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            isLoading: false,
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
        this.setState({isLoading: true});

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
            },
            isLoading: false
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
        const {searchTerm, results, searchKey, isLoading} = this.state;
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
                    <ButtonWithLoading
                        isLoading={isLoading}
                        onClick={()=>this.fetchSearchTopStories(searchKey,page+1)}>
                        More
                    </ButtonWithLoading>
                    
                </div>
                
            </div>
        );
    }
}

export default App;
