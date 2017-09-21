import React from 'react';

import './App.css';

const DEFAULT_QUERY = 'react';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);

// const list = [
//     {
//         title: 'React',
//         url: 'https://facebook.github.io/react/',
//         author: 'Jordan Walke',
//         num_comments: 3,
//         points: 4,
//         objectID: 0,
//     },
//     {
//         title: 'Redux',
//         url: 'https://github.com/reactjs/redux',
//         author: 'Dan Abramov, Andrew Clark',
//         num_comments: 2,
//         points: 5,
//         objectID: 1,
//     },
//     {
//         title: 'RxJs',
//         url: 'https://github.com/reactjs/redux',
//         author: 'Raks',
//         num_comments: 2,
//         points: 5,
//         objectID: 2,
//     },
//     {
//         title: 'Flux',
//         url: 'https://github.com/reactjs/redux',
//         author: 'Dds',
//         num_comments: 2,
//         points: 5,
//         objectID: 3,
//     },
//     {
//         title: 'MobX',
//         url: 'https://github.com/reactjs/redux',
//         author: 'dsk',
//         num_comments: 2,
//         points: 5,
//         objectID: 4,
//     },
// ];



const isSearched = (searchTerm) => (item) => {
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this); 
    }

    setSearchTopStories(result){
        this.setState({result});
    }

    fetchSearchTopStories(searchTerm){
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(e => e);
    }

    componentDidMount(){
        const {searchTerm} = this.state;
        this.fetchSearchTopStories(searchTerm);
    }

    onDismiss(id){
        const updatedHits = this.state.result.hits.filter(item => item.objectID !== id);
        this.setState({
            result: {...this.state.result, hits: updatedHits}
        });
    }

    onSearchChange(event){
        this.setState({searchTerm: event.currentTarget.value})
    }

    onSearchSubmit(event){
        const {searchTerm} = this.state;
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
    }

    render() {
        const {searchTerm, result} = this.state;

        if(!result){
            return null;
        }

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
                {result &&
                    <Table 
                        list={result.hits}
                        
                        onDismiss={this.onDismiss}
                    />
                }
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
