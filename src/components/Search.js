import React from 'react';
import PropTypes from 'prop-types';

class Search extends React.Component {

    componentDidMount(){
        this.input.focus();
    }

    render(){
        const {value, onChange, onSubmit, children} = this.props;

        return(
            <form onSubmit={onSubmit}>
                <strong>{children}</strong>
                <input 
                    type='text' 
                    value={value}
                    onChange={onChange}
                    ref={(node) => {this.input = node}}
                />
                <button type='submit'>
                    {children}
                </button>
            </form>
        );
    }
}

Search.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.string
};

export default Search;